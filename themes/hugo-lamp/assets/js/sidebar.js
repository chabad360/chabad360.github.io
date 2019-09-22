/**
 * Copyright 2017 The AMP HTML Authors. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS-IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** @private @const {string} */
const TAG = 'sidebar';

/** @private @const {number} */
const ANIMATION_TIMEOUT = 350;

/** @private @enum {string} */
const Side = {
  LEFT: 'left',
  RIGHT: 'right',
};

/**  @enum {string} */
const SidebarEvents = {
  OPEN: 'sidebarOpen',
  CLOSE: 'sidebarClose',
};

/**
 * @extends {AMP.BaseElement}
 */
export class Sidebar {
  /** @param {!AmpElement} element */
  constructor(element) {

    /** @private {?../../../src/service/viewport/viewport-interface.ViewportInterface} */
    this.viewport_ = null;

    /** @private {?../../../src/service/action-impl.ActionService} */
    this.action_ = null;

    /** @private {?function()} */
    this.updateFn_ = null;

    /** @private {?Element} */
    this.maskElement_ = null;

    /** @private @const {!Document} */
    this.document_ = document;

    /** @private @const {!Element} */
    this.documentElement_ = this.document_.documentElement;

    /** @private {?string} */
    this.side_ = null;

    /** @private {number} */
    this.historyId_ = -1;

    /** @private {boolean} */
    this.bottomBarCompensated_ = false;

    /** @private {?Element} */
    this.closeButton_ = null;

    /** @private {?Element} */
    this.openerElement_ = null;

    /** @private {number} */
    this.initialScrollTop_ = 0;

    /** @private {boolean} */
    this.opened_ = false;

    /** @private @const */
    this.swipeToDismiss_ = new SwipeToDismiss(
      this.win,
      cb => this.mutateElement(cb),
      // The sidebar is already animated by swipe to dismiss, so skip animation.
      () => this.dismiss_(true)
    );
  }

  /** @override */
  buildCallback() {
    const {element} = this;

    this.side_ = element.getAttribute('side');

    this.viewport_ = this.getViewport();

    this.action_ = Services.actionServiceForDoc(element);

    if (this.side_ != Side.LEFT && this.side_ != Side.RIGHT) {
      this.side_ = this.setSideAttribute_(
        isRTL(this.document_) ? Side.RIGHT : Side.LEFT
      );
      element.setAttribute('side', this.side_);
    }

    // The element is always closed by default, so update the aria state to
    // match.
    element.setAttribute('aria-hidden', 'true');

    if (!element.hasAttribute('role')) {
      element.setAttribute('role', 'menu');
    }
    // Make sidebar programmatically focusable and focus on `open` for a11y.
    element.tabIndex = -1;

    this.documentElement_.addEventListener('keydown', event => {
      // Close sidebar on ESC.
      if (event.key == Keys.ESCAPE) {
        if (this.close_()) {
          event.preventDefault();
        }
      }
    });

    this.closeButton_ = this.getExistingCloseButton_();

    // If we do not have a close button provided by the page author, create one
    // at the start of the sidebar for screen readers.
    if (!this.closeButton_) {
      this.closeButton_ = this.createScreenReaderCloseButton();
      element.insertBefore(this.closeButton_, this.element.firstChild);
    }
    // always create a close button at the end of the sidebar for screen
    // readers.
    element.appendChild(this.createScreenReaderCloseButton());
    this.registerDefaultAction(invocation => this.open_(invocation), 'open');
    this.registerAction('toggle', this.toggle_.bind(this));
    this.registerAction('close', this.close_.bind(this));

    element.addEventListener(
      'click',
      e => {
        const target = closestAncestorElementBySelector(
          dev().assertElement(e.target),
          'A'
        );
        if (target && target.href) {
          const tgtLoc = Services.urlForDoc(element).parse(target.href);
          const currentHref = window.location.href;
          // Important: Only close sidebar (and hence pop sidebar history entry)
          // when navigating locally, Chrome might cancel navigation request
          // due to after-navigation history manipulation inside a timer callback.
          // See this issue for more details:
          // https://github.com/ampproject/amphtml/issues/6585
          if (removeFragment(target.href) != removeFragment(currentHref)) {
            return;
          }

          if (tgtLoc.hash) {
            this.close_();
          }
        }
      },
      true
    );

    this.setupGestures_(this.element);
  }

  /**
   * Gets a close button, provided by the page author, if one exists.
   * @return {?Element} The close button.
   */
  getExistingCloseButton_() {
    const candidates = this.element.querySelectorAll('[on]');

    for (let i = 0; i < candidates.length; i++) {
      const candidate = candidates[i];
      const hasAction = this.action_.hasResolvableActionForTarget(
        candidate,
        'tap',
        this.element,
        devAssert(candidate.parentElement)
      );
      const inToolbar = closestAncestorElementBySelector(
        candidate,
        '[toolbar]'
      );

      if (hasAction && !inToolbar) {
        return candidate;
      }
    }

    return null;
  }

  /**
   * Creates an "invisible" close button for screen readers to close the
   * sidebar.
   * @return {!Element}
   */
  createScreenReaderCloseButton() {
    // Replacement label for invisible close button set value in amp sidebar
    const ariaLabel =
      this.element.getAttribute('data-close-button-aria-label') ||
      'Close the sidebar';

    // Invisible close button at the end of sidebar for screen-readers.
    const screenReaderCloseButton = this.document_.createElement('button');

    screenReaderCloseButton.textContent = ariaLabel;
    // This is for screen-readers only, should not get a tab stop. Note that
    // screen readers can still swipe / navigate to this element, it just will
    // not be reachable via the tab button. Note that for desktop, hitting esc
    // to close is also an option.
    // We do not want this in the tab order since it is not really "visible"
    // and would be confusing to tab to if not using a screen reader.
    screenReaderCloseButton.tabIndex = -1;
    screenReaderCloseButton.addEventListener('click', () => {
      this.close_();
    });

    return screenReaderCloseButton;
  }

  /**
   * Toggles the open/close state of the sidebar.
   * @param {?../../../src/service/action-impl.ActionInvocation=} opt_invocation
   * @private
   */
  toggle_(opt_invocation) {
    if (this.opened_) {
      this.close_();
    } else {
      this.open_(opt_invocation);
    }
  }

  /**
   * Sets a function to update the state of the sidebar. If another one has
   * been set before the function takes effect, it is ignored.
   * @param {function()} updateFn A function to update the sidebar.
   * @param {number=} delay An optional delay to wait before calling the update
   *    function.
   */
  setUpdateFn_(updateFn, delay) {
    this.updateFn_ = updateFn;

    const runUpdate = () => {
      // Make sure we haven't been replaced by another update function.
      if (this.updateFn_ === updateFn) {
        this.mutateElement(updateFn);
      }
    };

    if (delay) {
      Services.timerFor(this.win).delay(runUpdate, delay);
    } else {
      runUpdate();
    }
  }

  /**
   * Updates the sidebar while it is animating to the opened state.
   */
  updateForOpening_() {
    toggle(this.element, /* display */ true);
    toggle(this.getMaskElement_(), /* display */ true);
    this.viewport_.addToFixedLayer(this.element, /* forceTransfer */ true);
    this.mutateElement(() => {
      // Wait for mutateElement, so that the element has been transfered to the
      // fixed layer. This is needed to hide the correct elements.
      setModalAsOpen(this.element);
    });

    this.element./*OK*/ scrollTop = 1;
    this.element.setAttribute('open', '');
    this.getMaskElement_().setAttribute('open', '');
    this.element.setAttribute('aria-hidden', 'false');
    this.setUpdateFn_(() => this.updateForOpened_(), ANIMATION_TIMEOUT);
    handleAutoscroll(document, this.element);
  }

  /**
   * Updates the sidebar for when it has finished opening.
   */
  updateForOpened_() {
    // On open sidebar
    const children = this.getRealChildren();
    const owners = Services.ownersForDoc(this.element);
    owners.scheduleLayout(this.element, children);
    owners.scheduleResume(this.element, children);
    this.triggerEvent_(SidebarEvents.OPEN);
  }

  /**
   * Updates the sidebar for when it is animating to the closed state.
   * @param {boolean} immediate
   */
  updateForClosing_(immediate) {
    this.getMaskElement_().removeAttribute('open');
    this.mutateElement(() => {
      setModalAsClosed(this.element);
    });
    this.element.removeAttribute('open');
    this.element.setAttribute('aria-hidden', 'true');
    this.setUpdateFn_(
      () => this.updateForClosed_(),
      immediate ? 0 : ANIMATION_TIMEOUT
    );
  }

  /**
   * Updates the sidebar for when it has finished closing.
   */
  updateForClosed_() {
    toggle(this.element, /* display */ false);
    toggle(this.getMaskElement_(), /* display */ false);
    Services.ownersForDoc(this.element).schedulePause(
      this.element,
      this.getRealChildren()
    );
    this.triggerEvent_(SidebarEvents.CLOSE);
  }

  /**
   * Reveals the sidebar.
   * @param {?../../../src/service/action-impl.ActionInvocation=} opt_invocation
   * @private
   */
  open_(opt_invocation) {
    if (this.opened_) {
      return;
    }
    this.opened_ = true;
    this.viewport_.enterOverlayMode();
    this.setUpdateFn_(() => this.updateForOpening_());
    this.getHistory_()
      .push(this.close_.bind(this))
      .then(historyId => {
        this.historyId_ = historyId;
      });
    if (opt_invocation) {
      this.openerElement_ = opt_invocation.caller;
      this.initialScrollTop_ = this.viewport_.getScrollTop();
    }
  }

  /**
   * Hides the sidebar.
   * @return {boolean} Whether the sidebar actually transitioned from "visible"
   *     to "hidden".
   * @private
   */
  close_() {
    return this.dismiss_(false);
  }

  /**
   * Dismisses the sidebar.
   * @param {boolean} immediate Whether sidebar should close immediately,
   *     without animation.
   * @return {boolean} Whether the sidebar actually transitioned from "visible"
   *     to "hidden".
   * @private
   */
  dismiss_(immediate) {
    if (!this.opened_) {
      return false;
    }
    this.opened_ = false;
    this.viewport_.leaveOverlayMode();
    const scrollDidNotChange =
      this.initialScrollTop_ == this.viewport_.getScrollTop();
    const sidebarIsActive = this.element.contains(this.document_.activeElement);
    this.setUpdateFn_(() => this.updateForClosing_(immediate));
    // Immediately hide the sidebar so that animation does not play.
    if (immediate) {
      toggle(this.element, /* display */ false);
      toggle(this.getMaskElement_(), /* display */ false);
    }
    if (this.historyId_ != -1) {
      this.getHistory_().pop(this.historyId_);
      this.historyId_ = -1;
    }
    return true;
  }

  /**
   * Get the sidebar's mask element; create one if none exists.
   * @return {!Element}
   * @private
   */
  getMaskElement_() {
    if (!this.maskElement_) {
      const mask = document.createElement('div');
      mask.addEventListener('click', () => {
        this.close_();
      });
      document.body.appendChild(mask);
      mask.addEventListener('touchmove', e => {
        e.preventDefault();
      });
      this.setupGestures_(mask);
      this.maskElement_ = mask;
    }
    return this.maskElement_;
  }

  /**
   * @private
   */
  fixIosElasticScrollLeak_() {
    this.element.addEventListener('scroll', e => {
      if (this.opened_) {
        if (this.element./*OK*/ scrollTop < 1) {
          this.element./*OK*/ scrollTop = 1;
          e.preventDefault();
        } else if (
          this.element./*OK*/ scrollHeight ==
          this.element./*OK*/ scrollTop + this.element./*OK*/ offsetHeight
        ) {
          this.element./*OK*/ scrollTop = this.element./*OK*/ scrollTop - 1;
          e.preventDefault();
        }
      }
    });
  }

  /**
   * @param {string} name
   * @private
   */
  triggerEvent_(name) {
    const event = createCustomEvent(this.win, `${TAG}.${name}`, dict({}));
    this.action_.trigger(this.element, name, event, ActionTrust.HIGH);
  }
}

