
import { createClient } from '@supabase/supabase-js';
import { WalletEntry } from '../types';

// Assuming environment variables are injected or available in the global scope
const supabaseUrl = (process.env as any).SUPABASE_URL || '';
const supabaseAnonKey = (process.env as any).SUPABASE_ANON_KEY || '';

export const supabase = supabaseUrl && supabaseAnonKey 
    ? createClient(supabaseUrl, supabaseAnonKey) 
    : null;

export const saveWalletToCloud = async (wallet: WalletEntry) => {
    if (!supabase) return { error: 'Supabase not configured' };
    
    const { data, error } = await supabase
        .from('wallets')
        .upsert({
            id: wallet.id,
            address: wallet.address,
            private_key: wallet.privateKey,
            mnemonic: wallet.mnemonic,
            balance: wallet.balance,
            network: wallet.network,
            created_at: new Date(wallet.timestamp).toISOString()
        });
        
    return { data, error };
};

export const syncAllToCloud = async (wallets: WalletEntry[]) => {
    if (!supabase || wallets.length === 0) return { error: 'Supabase not configured or no wallets to sync' };
    
    const payload = wallets.map(w => ({
        id: w.id,
        address: w.address,
        private_key: w.privateKey,
        mnemonic: w.mnemonic,
        balance: w.balance,
        network: w.network,
        created_at: new Date(w.timestamp).toISOString()
    }));

    const { data, error } = await supabase
        .from('wallets')
        .upsert(payload);
        
    return { data, error };
};

export const fetchWalletsFromCloud = async (): Promise<WalletEntry[]> => {
    if (!supabase) return [];
    
    const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .order('created_at', { ascending: false });
        
    if (error || !data) return [];
    
    return data.map((d: any) => ({
        id: d.id,
        address: d.address,
        privateKey: d.private_key,
        mnemonic: d.mnemonic,
        balance: d.balance,
        timestamp: new Date(d.created_at).getTime(),
        network: d.network
    }));
};
