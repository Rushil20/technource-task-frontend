import React from 'react';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface FilterDropdownProps {
    label: string;
    value: string | number;
    options: Array<string | number>;
    onChange: (value: string | number) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({ label, value, options, onChange }) => {
    return (
        <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>{label}</InputLabel>
            <Select
                value={value}
                label={label}
                onChange={e => onChange(e.target.value)}
            >
                <MenuItem value="">All</MenuItem>
                {options.map(opt => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default FilterDropdown; 