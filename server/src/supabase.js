require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zadpqradafqqdmenzgca.supabase.co';
// Prioritize Service Role Key for backend operations to bypass RLS
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY || 'sb_publishable_vJrYRDYFXW7_q0NRy4gDcg_2nLLdKLW';

if (!supabaseUrl || !supabaseKey) {
    console.error("Supabase URL or Key missing!");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };
