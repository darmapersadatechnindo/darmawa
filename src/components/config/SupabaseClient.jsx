import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://lnwaymkojjezwuidsuoa.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxud2F5bWtvamplend1aWRzdW9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwOTgxMTcsImV4cCI6MjA1NDY3NDExN30.gFTszbNr_q6kV46NIxQ-XocLaeiB_JsS2DVqoZW00P0"

const supabase = createClient(supabaseUrl, supabaseKey)

const SupabaseClient = {

    getWhere: async (table, columns, value) => {
        const { data } = await supabase.from(table).select().eq(columns, value).order("id", { ascending: false });
        return data
    },
    getDevice: async (table, column1, value1,column2,value2) => {
        const { data } = await supabase
            .from(table)
            .select()
            .eq(column1, value1)
            .eq(column2, value2)
            .order("id", { ascending: false });
        return data;
    },
    getWhereNot: async (table, column, value) => {
        const { data } = await supabase
            .from(table)
            .select()
            .neq(column, value)
            .order("id", { ascending: false });

        return data;
    },
    Update: async (table, json, columns, value) => {
        const { data } = await supabase.from(table).update(json).eq(columns, value).select();
        return data
    },
    getAll: async (table, orderBy, ascending = true) => {
        const { data } = await supabase.from(table).select("*").order(orderBy, { ascending });
        return data;
    },
    getAllCount: async (table, orderBy, ascending = true, limit) => {
        const { data } = await supabase.from(table).select("*").order(orderBy, { ascending }).range(0, limit);
        return data;
    },
    Insert: async (table, json) => {
        const { data } = await supabase.from(table).insert([json]).select();
        return data
    },
    Delete: async (table, columns, value) => {
        const { data } = await supabase.from(table).delete().eq(columns, value);
        return data
    },
}
export default SupabaseClient