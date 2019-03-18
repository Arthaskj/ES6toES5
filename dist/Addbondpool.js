'use strict';

Box.define('HY.rating.warn.Addbondpool', {
    extend: 'Box.Component',
    elements: {
        _BondType: '._BondType',
        BondIn: '.BondIn',
        BondOut: '.BondOut',
        Coment: '.Coment'
    },
    $params: {},
    templates: {
        main: 'Res/modules/rating/warn/tpl/Addbondpool.html'

    },

    bt_type: null,

    ChangeState: function ChangeState() {
        var me = this;
        $(".BondIn").click(function () {
            $(".BondOut").attr("checked", false);
            me.el._BondType.data("kendoDropDownList").readonly(false);
            //$(".Coment").removeAttr("readonly");
        });
        $(".BondOut").click(function () {
            $(".BondIn").attr("checked", false);
            me.bondtype.value(me.bt_type);
            me.el._BondType.data("kendoDropDownList").readonly();
            //$(".Coment").attr("readonly", "readonly");
        });
    },

    setup: function setup() {
        var me = this;
        var uni = this.$params.data.BondKey;
        $.ajax({
            url: "api/InterMgr/BondPool/GetPool",
            type: "get",
            data: { key: uni },
            async: false,
            success: function success(result) {
                if (result) {
                    me.el.Coment.val(result.Coment);
                    var bt_option = [];
                    if (result.BondPoolType && result.BondPoolType.length > 0) {
                        result.BondPoolType.forEach(function (item) {
                            bt_option.push({ text: item, value: item });
                        });
                    }
                    var option = {
                        dataTextField: "text",
                        dataValueField: "value",
                        dataSource: bt_option
                    };
                    me.bondtype = me.el._BondType.kendoDropDownList(option).data("kendoDropDownList");
                    if (result.BondType) {
                        me.bondtype.value(result.BondType);
                        me.bt_type = result.BondType;
                        $(".dealside-in").text("换池");
                    }
                    if (!result.OpType) {
                        $(".BondOut").css("display", "none");
                        $(".dealside-out").css("display", "none");
                    }
                }
            }
        });
        if (this.$params.data && this.$params.data.BP) {
            $(".dealside-in").text("换池");
        }
        this.ChangeState();
        //if (this.$params.data.value.Date) {
        //    var item = this.$params.data.value;
        //    this.date.val(Box.format.renderDate(item.Date));
        //    this.ratetype.value(item.RateType);
        //    //this.el.RateType.val(item.RateType);
        //    this.el.Body.val(item.Body);
        //    this.el.Title.val(item.Title);
        //}
    },
    getValue: function getValue() {
        var req = {};
        if (this.$params) {
            req.BondKey = this.$params.data.BondKey;
            req.BondName = this.$params.data.BondName;
        }
        var ot = $(".DealSide").find(':radio:checked').val();
        if (ot == "true") {
            req.OpType = true;
        } else {
            req.OpType = false;
        }
        req.BondType = this.bondtype.value();
        req.Coment = this.el.Coment.val();
        return req;
    }
});