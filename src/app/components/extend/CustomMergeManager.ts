import * as wjcGrid from '@grapecity/wijmo.grid';

export class CustomMergeManager extends wjcGrid.MergeManager {

    getMergedRange(panel: wjcGrid.GridPanel, r: number, c: number, clip = true): wjcGrid.CellRange {
        // create basic cell range
        var rg = new wjcGrid.CellRange(r, c);

        // expand left/right
        for (var i = rg.col; i < panel.columns.length - 1; i++) {
            if (panel.getCellData(rg.row, i, true) != panel.getCellData(rg.row, i + 1, true)) break;
            rg.col2 = i + 1;
        }
        for (var i = rg.col; i > 0; i--) {
            if (panel.getCellData(rg.row, i, true) != panel.getCellData(rg.row, i - 1, true)) break;
            rg.col = i - 1;
        }

        // expand up/down
        for (var i = rg.row; i < panel.rows.length - 1; i++) {
            if (panel.getCellData(i, rg.col, true) != panel.getCellData(i + 1, rg.col, true)) break;
            rg.row2 = i + 1;
        }
        for (var i = rg.row; i > 0; i--) {
            if (panel.getCellData(i, rg.col, true) != panel.getCellData(i - 1, rg.col, true)) break;
            rg.row = i - 1;
        }
        // done
        return rg;
    }

}