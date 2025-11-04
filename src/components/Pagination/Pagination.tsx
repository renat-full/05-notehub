import ReactPaginate from 'react-paginate';
import css from './Pagination.module.css';

interface PaginationProps {
    totalPages: number;
    onPageChange: (selectedItem: { selected: number }) => void;
    forcePage: number;
}

const Pagination: React.FC<PaginationProps> = ({ totalPages, onPageChange, forcePage }) => {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className={css.container}>
            <ReactPaginate
                breakLabel="..."
                nextLabel="→"
                onPageChange={onPageChange}
                forcePage={forcePage}
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
                pageCount={totalPages}
                previousLabel="←"
                renderOnZeroPageCount={null}

                containerClassName={css.pagination}
                pageLinkClassName={css.pageLink}
                activeLinkClassName={css.active}
                previousLinkClassName={css.arrowLink}
                nextLinkClassName={css.arrowLink}
                breakLinkClassName={css.breakLink}
                disabledLinkClassName={css.disabledLink}
            />
        </div>
    );
};

export default Pagination;