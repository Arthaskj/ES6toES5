"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/*
* @Author: Ke Jun
* @Description: 持仓负面舆情功能开发
* @Date: 2019-03-06 13:29:20
* @LastEditTime: 2019-03-14 18:10:05
*/
Box.define("HY.rating.warn.negativeOpinions.holdOpinions", {

    name: "持仓负面舆情",

    extend: "Box.GridPage",

    requires: [],

    $params: undefined,
    table_sortable: false,
    oldSource: null,
    autoLoadData: true,
    //customHeight: true,

    ajaxUrl: 'api/WarnMgr/News/QueryNegativeNews_Holding',

    delegates: {
        'click {.tdBond}': 'show_window_bond',
        'click {.tdComp}': 'show_window_comp'

    },

    //重要性枚举值--表格数据用
    ImportStart: {
        0: '<font class="fa fa-star" color="#b1b1b1"></font><font class="fa fa-star" color="#b1b1b1"></font><font class="fa fa-star" color="#b1b1b1"></font>',
        1: '<font class="fa fa-star" color="#ff7800"></font><font class="fa fa-star" color="#b1b1b1"></font><font class="fa fa-star" color="#b1b1b1"></font>',
        2: '<font class="fa fa-star" color="#ff7800"></font><font class="fa fa-star" color="#ff7800"></font><font class="fa fa-star" color="#b1b1b1"></font>',
        3: '<font class="fa fa-star" color="#ff7800"></font><font class="fa fa-star" color="#ff7800"></font><font class="fa fa-star" color="#ff7800"></font>'
    },
    //重要性枚举值--搜索框数据用
    $SearchList: [{ text: '<font class="fa fa-star" color="#b1b1b1"></font><font class="fa fa-star" color="#b1b1b1"></font><font class="fa fa-star" color="#b1b1b1"></font>', value: "0", title: "0星" }, { text: '<font class="fa fa-star" color="#ff7800"></font><font class="fa fa-star" color="#b1b1b1"></font><font class="fa fa-star" color="#b1b1b1"></font>', value: "1", title: "1星" }, { text: '<font class="fa fa-star" color="#ff7800"></font><font class="fa fa-star" color="#ff7800"></font><font class="fa fa-star" color="#b1b1b1"></font>', value: "2", title: "2星" }, { text: '<font class="fa fa-star" color="#ff7800"></font><font class="fa fa-star" color="#ff7800"></font><font class="fa fa-star" color="#ff7800"></font>', value: "3", title: "3星" }],

    init: function init() {
        var me = this,
            height = $(window).height();
        this.Win = this.gridpage.wrapper;
        this.el.target.find(".table-body").css("height", height - 175);
        Box.HYResize($(window), function () {
            var height = $(window).height();
            me.el.target.find(".table-body").css("height", height - 175).find(".k-grid-content").css("height", height - 235);
        });
    },

    pageable: _defineProperty({
        pageSizes: true, //是否显示控制每页显示条数的按钮
        buttonCount: 3, //显示的分页按钮个数
        pageSize: 30 }, "pageSizes", [30, 50, 100, 'All']),
    table_order: [{ field: "MessageTime", dir: "desc" }],

    beforeSetup: function beforeSetup() {
        var me = this;
        this.table_search = [{
            name: 'MessageTime',
            text: '发布日期',
            type: 'rangeDate',
            // isAdvanced: true,
            value: {
                startDate: Box.format.renderDate(new Date().addDays(-183)),
                endDate: Box.format.renderDate(new Date())
            },
            width: 160
        }, {
            name: 'BondKey',
            text: '债券代码',
            type: 'bondsearch',
            SetFilterValue: true,
            operator: 'contains',
            placeholder: "债券代码、简称皆可",
            width: 160,
            _option: {
                fixValue: false,
                selectFirstWhenClose: false
            }
        }, {
            name: 'ObjectName',
            text: '关联主体',
            type: 'compsearch',
            operator: 'contains',
            placeholder: "请输入主体名称",
            width: 160,
            _option: {
                fixValue: false,
                selectFirstWhenClose: false
            }
        }];

        this.table_columns = [{
            field: "Title",
            title: "新闻标题",
            width: 100,
            template: function template(item) {
                if (item.Link) {
                    return '<a href="\\#rating/warn/opinions/detail?id=' + (item.Code || "") + '" target="_blank" class="td-tool-btn"  title="查看详细新闻信息">' + (item.Title || '') + '</a>';
                } else {
                    return item.Title || '--';
                }
            }
        }, {
            field: "NewsCategory",
            title: "新闻分类",
            width: 20,
            headerAttributes: { "style": "text-align:center;" },
            attributes: { "style": "text-align:center;" },
            template: function template(item) {
                return item.NewsCategory || "主体新闻";
            }
        }, {
            field: "Importance",
            title: "重要性",
            width: 20,
            headerAttributes: { "style": "text-align:center;" },
            attributes: { "style": "text-align:center;" },
            template: function template(item) {
                return me.ImportStart[item.Importance] || "--";
            }
        }, {
            field: "From",
            title: "新闻来源",
            width: 30,
            template: function template(item) {
                return item.From || "--";
            }
        }, {
            field: "BondKey",
            title: "新闻来源",
            width: 30,
            hidden: true,
            template: function template(item) {
                return "--";
            }
        }, {
            field: "MessageTime",
            title: "发布时间",
            width: 30,
            template: function template(item) {
                return Box.format.renderDatetime(item.MessageTime);
            }
        }, {
            field: "ObjectName",
            title: "持仓债券",
            width: 60,
            attributes: { "style": "padding:0;" },
            template: function template(item) {
                var str = me.renderTableInTable(item.Bonds, true);
                return str;
            }
        }, {
            field: "ObjectName",
            title: "关联主体",
            width: 60,
            attributes: { "style": "padding:0;" },
            template: function template(item) {
                var str = me.renderTableInTable(item.Bonds, false);
                return str;
            }
        }];
    },

    //渲染表格中特殊数据
    renderTableInTable: function renderTableInTable(data, type) {
        var rlt = '<font style="padding:.4em .6em;">--</font>';
        if (!data) return rlt;
        if (data.length > 0) {
            var table = $('<table></table>');
            data.forEach(function (x, index) {
                var tr = $('<tr style="' + (data.length == 1 ? "" : 'background:' + (index % 2 ? "#f5f5f5" : "#fff")) + '" data-bondkey="' + (x.BondKey || "") + '" data-bondname="' + (x.BondName || "") + '" data-compname="' + (x.NewsCompanyName || "") + '" data-compcode="' + (x.NewsCompCode || "") + '">' + '<td style="border-width:0 0 1px 0 !important">' + (type ? x.BondKey ? '<a class="tdBond" href="javascript:void(0)">' + (x.BondName || "") + "【" + x.BondKey + '】</a>' : x.BondName || "--" : x.NewsCompCode ? '<a class="tdComp" href="javascript:void(0)">' + (x.Relation ? '<font color="#f4333c">【' + x.Relation + '】</font>' : "") + (x.NewsCompanyName + '</a>') : (x.Relation ? '<font color="#f4333c">【' + x.Relation + '】</font>' : "") + x.NewsCompanyName) + '</td></tr>');
                table.append(tr);
                tr.data("datas", x);
            });
            table.find('tr').last().find("td").css("border-bottom", "none");

            rlt = table[0].outerHTML;
        }
        return rlt;
    },

    show_window_bond: function show_window_bond(e, target) {
        var tr = $(e.target).closest("tr"),
            data = tr.data();

        Box.BondOrCompMsgPage(data.bondkey, data.bondname, "bond");
    },

    show_window_comp: function show_window_comp(e, target) {
        var tr = $(e.target).closest("tr"),
            data = tr.data();

        Box.BondOrCompMsgPage(data.compcode, data.compname, "comp");
    },

    //刷新表格
    fnRefreshGrid: function fnRefreshGrid() {
        this.fnRefresh();
    },

    //重置数据
    ResetSource: function ResetSource() {
        this.oldSource && this.gridpage.setDataSource(this.oldSource);
        this.fnResetSearch();
        this.fnRefresh();
    },

    //导出excel
    doExport: function doExport() {
        var title = "新闻-负面新闻汇总数据";
        this.$win.doExport(this.gridpage, title, this);
    }
});