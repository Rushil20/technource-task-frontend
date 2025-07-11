import React from 'react';
import { Pagination as MuiPagination, Stack } from '@mui/material';

interface PaginationProps {
    page: number;
    count: number;
    onChange: (event: React.ChangeEvent<unknown>, value: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ page, count, onChange }) => {
    return (
        <Stack alignItems="center" mt={3}>
            <MuiPagination
                page={page}
                count={count}
                onChange={onChange}
                color="primary"
                shape="rounded"
            />
        </Stack>
    );
};

export default Pagination; 