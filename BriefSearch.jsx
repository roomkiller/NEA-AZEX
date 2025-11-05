import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

export default function BriefSearch({ value, onChange }) {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--nea-text-secondary)]" />
            <Input
                placeholder="Rechercher dans les briefs..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-10"
            />
        </div>
    );
}