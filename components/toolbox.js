! function (t, e) {
    if ("object" == typeof exports && "object" == typeof module) module.exports = e(require("blockly/core"));
    else if ("function" == typeof define && define.amd) define(["blockly/core"], e);
    else { var o = "object" == typeof exports ? e(require("blockly/core")) : e(t.Blockly); for (var s in o) ("object" == typeof exports ? exports : t)[s] = o[s] }
}(this, (function (t) {
    return function (t) {
        var e = {};

        function o(s) { if (e[s]) return e[s].exports; var i = e[s] = { i: s, l: !1, exports: {} }; return t[s].call(i.exports, i, i.exports, o), i.l = !0, i.exports }
        return o.m = t, o.c = e, o.d = function (t, e, s) { o.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: s }) }, o.r = function (t) { "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }), Object.defineProperty(t, "__esModule", { value: !0 }) }, o.t = function (t, e) {
            if (1 & e && (t = o(t)), 8 & e) return t;
            if (4 & e && "object" == typeof t && t && t.__esModule) return t;
            var s = Object.create(null);
            if (o.r(s), Object.defineProperty(s, "default", { enumerable: !0, value: t }), 2 & e && "string" != typeof t)
                for (var i in t) o.d(s, i, function (e) { return t[e] }.bind(null, i));
            return s
        }, o.n = function (t) { var e = t && t.__esModule ? function () { return t.default } : function () { return t }; return o.d(e, "a", e), e }, o.o = function (t, e) { return Object.prototype.hasOwnProperty.call(t, e) }, o.p = "/dist/", o(o.s = 1)
    }([function (e, o) { e.exports = t }, function (t, e, o) {
        "use strict";
        o.r(e), o.d(e, "ContinuousCategory", (function () { return i })), o.d(e, "ContinuousFlyout", (function () { return l })), o.d(e, "ContinuousMetrics", (function () { return c })), o.d(e, "ContinuousToolbox", (function () { return r }));
        var s = o(0);
        /**
         * @license
         * Copyright 2020 Google LLC
         * SPDX-License-Identifier: Apache-2.0
         */
        class i extends s.ToolboxCategory {
            constructor(t, e) { super(t, e) }
            createLabelDom_(t) { const e = document.createElement("div"); return e.setAttribute("id", this.getId() + ".label"), e.textContent = t, e.classList.add(this.cssConfig_.label), e }
            createIconDom_() { const t = document.createElement("div"); return t.classList.add("categoryBubble"), t.style.backgroundColor = this.colour_, t }
            addColourBorder_() { }
            setSelected(t) { t ? (this.rowDiv_.style.backgroundColor = "gray", s.utils.dom.addClass(this.rowDiv_, this.cssConfig_.selected)) : (this.rowDiv_.style.backgroundColor = "", s.utils.dom.removeClass(this.rowDiv_, this.cssConfig_.selected)), s.utils.aria.setState(this.htmlDiv_, s.utils.aria.State.SELECTED, t) }
        }
        s.registry.register(s.registry.Type.TOOLBOX_ITEM, s.ToolboxCategory.registrationName, i, !0);
        /**
         * @license
         * Copyright 2020 Google LLC
         * SPDX-License-Identifier: Apache-2.0
         */
        class r extends s.Toolbox {
            constructor(t) { super(t) }
            init() {
                super.init();
                const t = this.getFlyout();
                t.show(this.getInitialFlyoutContents_()), t.recordScrollPositions()
            }
            getFlyout() { return super.getFlyout() }
            getInitialFlyoutContents_() {
                let t = [];
                for (const e of this.contents_)
                    if (e instanceof s.ToolboxCategory) { t.push({ kind: "LABEL", text: e.getName() }); let o = e.getContents(); "string" == typeof o && (o = { custom: o, kind: "CATEGORY" }), t = t.concat(o) }
                return t
            }
            refreshSelection() { this.getFlyout().show(this.getInitialFlyoutContents_()) }
            updateFlyout_(t, e) {
                if (e) {
                    const t = this.getFlyout().getCategoryScrollPosition(e.name_).y;
                    this.getFlyout().scrollTo(t)
                }
            }
            shouldDeselectItem_(t, e) { return t && t !== e }
            getCategoryByName(t) { const e = this.contents_.find(e => e instanceof s.ToolboxCategory && e.isSelectable() && t === e.getName()); return e || null }
            selectCategoryByName(t) {
                const e = this.getCategoryByName(t);
                if (!e) return;
                const o = this.selectedItem_;
                this.shouldDeselectItem_(o, e) && this.deselectItem_(o), this.shouldSelectItem_(o, e) && this.selectItem_(o, e)
            }
            getClientRect() { const t = this.getFlyout(); return t && !t.autoClose ? t.getClientRect() : super.getClientRect() }
        }
        s.Css.register(
            `.categoryBubble {
                margin: 0 auto 0.125rem;
                border-radius: 6px;
                box-shadow:inset -3px -3px 7px rgba(0, 0, 0, .5);
                border: 1px solid;
                width: 1.25rem;
                height: 1.25rem;
            }
        .blocklyTreeRow {
            height: initial;
            padding: 3px 0;
            }
        .blocklyTreeRowContentContainer {
            display: flex;
            flex-direction: column;
        }
        .blocklyTreeLabel {font-weight: 600;}`
        );
        // [".categoryBubble {\n      margin: 0 auto 0.125rem;\n      border-radius: 6px;\n  box-shadow:inset -3px -3px 7px rgba(0, 0, 0, .5);\n    border: 1px solid;\n      width: 1.25rem;\n      height: 1.25rem;\n    }\n    .blocklyTreeRow {\n      height: initial;\n      padding: 3px 0;\n    }\n    .blocklyTreeRowContentContainer {\n      display: flex;\n      flex-direction: column;\n    }\n    .blocklyTreeLabel {\n      font-weight: 600;\n    }"]);
        /**
         * @license
         * Copyright 2021 Google LLC
         * SPDX-License-Identifier: Apache-2.0
         */
        class n extends s.FlyoutMetricsManager {
            constructor(t, e) { super(t, e) }
            getScrollMetrics(t, e, o) {
                const s = super.getScrollMetrics(t, e, o),
                    i = o || this.getContentMetrics(t),
                    r = e || this.getViewMetrics(t);
                return s && (s.height += this.flyout_.calculateBottomPadding(i, r)), s
            }
        }
        /**
         * @license
         * Copyright 2020 Google LLC
         * SPDX-License-Identifier: Apache-2.0
         */
        class l extends s.VerticalFlyout {
            constructor(t) { super(t), this.scrollPositions = [], this.scrollTarget = null, this.scrollAnimationFraction = .3, this.recycleBlocks_ = [], this.recyclingEnabled_ = !0, this.workspace_.setMetricsManager(new n(this.workspace_, this)), this.autoClose = !1 }
            getParentToolbox_() { return this.targetWorkspace.getToolbox() }
            recordScrollPositions() { this.scrollPositions = []; const t = this.buttons_.filter(t => t.isLabel() && this.getParentToolbox_().getCategoryByName(t.getButtonText())); for (const e of t) e.isLabel() && this.scrollPositions.push({ name: e.getButtonText(), position: e.getPosition() }) }
            getCategoryScrollPosition(t) {
                for (const e of this.scrollPositions)
                    if (e.name === t) return e.position;
                return console.warn(`Scroll position not recorded for category ${t}`), null
            }
            selectCategoryByScrollPosition_(t) { if (this.scrollTarget) return; const e = Math.round(t / this.workspace_.scale); for (let t = this.scrollPositions.length - 1; t >= 0; t--) { const o = this.scrollPositions[t]; if (e >= o.position.y) return void this.getParentToolbox_().selectCategoryByName(o.name) } }
            scrollTo(t) {
                const e = this.workspace_.getMetrics();
                this.scrollTarget = Math.min(t * this.workspace_.scale, e.scrollHeight - e.viewHeight), this.stepScrollAnimation_()
            }
            stepScrollAnimation_() {
                if (!this.scrollTarget) return;
                const t = -this.workspace_.scrollY,
                    e = this.scrollTarget - t;
                if (Math.abs(e) < 1) return this.workspace_.scrollbar.setY(this.scrollTarget), void (this.scrollTarget = null);
                this.workspace_.scrollbar.setY(t + e * this.scrollAnimationFraction), requestAnimationFrame(this.stepScrollAnimation_.bind(this))
            }
            calculateBottomPadding(t, e) {
                if (this.scrollPositions.length > 0) {
                    const o = this.scrollPositions[this.scrollPositions.length - 1].position.y * this.workspace_.scale,
                        s = t.height - o;
                    if (s < e.height) return e.height - s
                }
                return 0
            }
            setMetrics_(t) { super.setMetrics_(t), this.scrollPositions && this.selectCategoryByScrollPosition_(-this.workspace_.scrollY) }
            position() {
                if (!this.isVisible()) return;
                const t = this.targetWorkspace.getMetrics();
                if (!t) return;
                this.height_ = t.viewHeight;
                const e = this.width_ - this.CORNER_RADIUS,
                    o = t.viewHeight - 2 * this.CORNER_RADIUS;
                this.setBackgroundPath_(e, o);
                let i = 0;
                i = this.targetWorkspace.toolboxPosition == this.toolboxPosition_ ? t.toolboxWidth ? this.toolboxPosition_ == s.TOOLBOX_AT_LEFT ? t.toolboxWidth : t.viewWidth : this.toolboxPosition_ == s.TOOLBOX_AT_LEFT ? 0 : t.viewWidth : this.toolboxPosition_ == s.TOOLBOX_AT_LEFT ? 0 : t.viewWidth + t.absoluteLeft - this.width_, this.positionAt_(this.width_, this.height_, i, 0)
            }
            show(t) { super.show(t), this.emptyRecycleBlocks_(), this.recordScrollPositions(), this.workspace_.resizeContents() }
            emptyRecycleBlocks_() {
                const t = this.recycleBlocks_;
                this.recycleBlocks_ = [];
                for (const e of t) e.dispose(!1, !1)
            }
            createBlock_(t) {
                const e = t.getAttribute("type"),
                    o = this.recycleBlocks_.findIndex((function (t) { return t.type === e }));
                let i;
                return i = o > -1 ? this.recycleBlocks_.splice(o, 1)[0] : s.Xml.domToBlock(t, this.workspace_), i.isEnabled() || this.permanentlyDisabled_.push(i), i
            }
            clearOldBlocks_() {
                const t = this.workspace_.getTopBlocks(!1);
                for (const e of t) e.workspace == this.workspace_ && (this.recyclingEnabled_ && this.blockIsRecyclable_(e) ? this.recycleBlock_(e) : e.dispose(!1, !1));
                for (const t of this.mats_) t && (s.Tooltip.unbindMouseEvents(t), s.utils.dom.removeNode(t));
                this.mats_.length = 0;
                for (const t of this.buttons_) t.dispose();
                this.buttons_.length = 0, this.workspace_.getPotentialVariableMap().clear()
            }
            blockIsRecyclable_(t) { if (t.mutationToDom && t.domToMutation) return !1; for (const e of t.inputList) { for (const t of e.fieldRow) { if (t instanceof s.FieldVariable) return !1; if (t instanceof s.FieldDropdown && t.isOptionListDynamic()) return !1 } if (e.connection) { const t = e.connection.targetBlock(); if (t && !this.blockIsRecyclable_(t)) return !1 } } return !0 }
            setBlockIsRecyclable(t) { this.blockIsRecyclable_ = t }
            setRecyclingEnabled(t) { this.recyclingEnabled_ = t }
            recycleBlock_(t) {
                const e = t.getRelativeToSurfaceXY();
                t.moveBy(-e.x, -e.y), this.recycleBlocks_.push(t)
            }
        }
        /**
         * @license
         * Copyright 2021 Google LLC
         * SPDX-License-Identifier: Apache-2.0
         */
        class c extends s.MetricsManager {
            constructor(t) { super(t) }
            getViewMetrics(t) {
                const e = t ? this.workspace_.scale : 1,
                    o = this.getSvgMetrics(),
                    i = this.getToolboxMetrics(),
                    r = this.getFlyoutMetrics(!1),
                    n = i.position;
                return this.workspace_.getToolbox() && (n == s.TOOLBOX_AT_TOP || n == s.TOOLBOX_AT_BOTTOM ? o.height -= i.height + r.height : n != s.TOOLBOX_AT_LEFT && n != s.TOOLBOX_AT_RIGHT || (o.width -= i.width + r.width)), { height: o.height / e, width: o.width / e, top: -this.workspace_.scrollY / e, left: -this.workspace_.scrollX / e }
            }
            getAbsoluteMetrics() {
                const t = this.getToolboxMetrics(),
                    e = this.getFlyoutMetrics(!1),
                    o = t.position;
                let i = 0;
                this.workspace_.getToolbox() && o == s.TOOLBOX_AT_LEFT && (i = t.width + e.width);
                let r = 0;
                return this.workspace_.getToolbox() && o == s.TOOLBOX_AT_TOP && (r = t.height + e.height), { top: r, left: i }
            }
        }
        s.registry.register(s.registry.Type.METRICS_MANAGER, "CustomMetricsManager", c)
    }])
}));
//# sourceMappingURL=continuous_tool_box_index.js.map