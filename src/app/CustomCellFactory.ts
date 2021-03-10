import * as wjcCore from '@grapecity/wijmo';
import * as wjcGrid from '@grapecity/wijmo.grid';

export class CustomCellFactory extends wjcGrid.CellFactory {
    /**
     * Creates or updates a pCell in the grid.
     *
     * @param pGrid The @see:GridPanel that contains the pCell.
     * @param pRow The index of the row that contains the pCell.
     * @param pColumn The index of the column that contains the pCell.
     * @param pCell The element that represents the pCell.
     * @param pRng The @see:CellRange object that contains the pCell's 
     * merged range, or null if the pCell is not merged.
     * @param pUpdateContent Whether to update the pCell's content as
     * well as its position and style.
     */
    public updateCell(pGrid: wjcGrid.GridPanel, pRow: number, pColumn: number, pCell: HTMLElement, pRng?: wjcGrid.CellRange, pUpdateContent?: boolean) {
        switch (pGrid.cellType) {

            // regular cells
            case wjcGrid.CellType.Cell:

                // get pCell geometry
                super.updateCell(pGrid, pRow, pColumn, pCell, pRng, false);

                let binding = pGrid.columns[pColumn].binding;
                if (binding === 'TotalOriginalAmount') {
                    let value: number = pGrid.getCellData(pRow, pColumn, false)
                    if (value > 350000000) { wjcCore.addClass(pCell, 'blue'); }
                }

                if (binding === 'DocDate') { wjcCore.addClass(pCell, 'blue') }

                // add/update content
                var content = pGrid.getCellData(pRow, pColumn, true);
                if (pCell.textContent != content) { pCell.innerHTML = '<div>' + content + '</div>'; }
                break;

            // column headers
            case wjcGrid.CellType.ColumnHeader:

                // get pCell geometry
                super.updateCell(pGrid, pRow, pColumn, pCell, pRng, false);

                // set styles
                wjcCore.addClass(pCell, 'rotated-pCell');

                // add content
                var content = pGrid.getCellData(pRow, pColumn, true);
                if (pCell.textContent != content) { pCell.innerHTML = '<div>' + content + '</div>'; }
                break;

            case wjcGrid.CellType.RowHeader:
                super.updateCell(pGrid, pRow, pColumn, pCell, pRng, false);
                pCell.innerHTML = '<div>' + (pRow + 1) + '</div>';
                break;

            case wjcGrid.CellType.TopLeft:
                super.updateCell(pGrid, pRow, pColumn, pCell, pRng, false);
                pCell.innerHTML = '<div>' + '<span class="wj-glyph-down-right"></span>' + '</div>';
                break;

            case wjcGrid.CellType.BottomLeft:
                super.updateCell(pGrid, pRow, pColumn, pCell, pRng, false);
                pCell.innerHTML = '&#931;';
                break;

            case wjcGrid.CellType.ColumnFooter:
                super.updateCell(pGrid, pRow, pColumn, pCell, pRng, false);
                let bindingFooter = pGrid.columns[pColumn].binding;
                let list = pGrid.grid.collectionView.items;
                if (bindingFooter === 'TotalOriginalAmount') {
                    let total = 0;
                    for (let i = 0; i < list.length; i++) { total += parseFloat(list[i].TotalOriginalAmount) }
                    pCell.innerHTML = `${total?.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
                }
                break;

            // other pCell types
            default:
                super.updateCell(pGrid, pRow, pColumn, pCell, pRng, true);
                break;
        }
    }
}