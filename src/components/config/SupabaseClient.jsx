import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://nmnuuvlcsxzpdandjbtt.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5tbnV1dmxjc3h6cGRhbmRqYnR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzkwODYzOTMsImV4cCI6MjA1NDY2MjM5M30.WELP7_4ax1Fv1-ef5VZ-MJ7lzRbdChSYPUj0RDXNUh0"

const supabase = createClient(supabaseUrl, supabaseKey)

const SupabaseClient = {
    
    getWhere: async(table,columns,value)=>{
        const {data} = await supabase.from(table).select().eq(columns,value).order("id", { ascending: false });
        return data
    },
    
    getWhereNot: async (table, column, value) => {
        const { data } = await supabase
            .from(table)
            .select()
            .neq(column, value) 
            .order("id", { ascending: false });
    
        return data;
    },    
    Update: async(table,json,columns,value)=>{
        const {data} = await supabase.from(table).update(json).eq(columns,value).select();
        return data
    },
    getAll : async(table,orderBy, ascending = true)=>{
        const {data} = await supabase.from(table).select("*").order(orderBy, { ascending });
        return data;
    },
    getAllCount : async(table,orderBy, ascending = true,limit)=>{
        const {data} = await supabase.from(table).select("*").order(orderBy, { ascending }).range(0,limit);
        return data;
    },
    Insert: async(table,json)=>{
        const {data} = await supabase.from(table).insert([json]).select();
        return data
    },
    Delete: async(table,columns,value)=>{
        const {data} = await supabase.from(table).delete().eq(columns,value);
        return data
    },
}
export default SupabaseClient