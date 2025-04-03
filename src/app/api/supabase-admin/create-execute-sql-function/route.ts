import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase';

export async function GET() {
  try {
    // This should be protected with admin authentication in a real application
    const supabase = createClient();
    
    // Create the execute_sql RPC function if it doesn't exist
    const { error } = await supabase.rpc('create_execute_sql_function', {});
    
    if (error) {
      // Function might not exist yet, let's create it
      const { error: createError } = await supabase.from('_rpc').select('*').eq('name', 'create_execute_sql_function');
      
      if (createError) {
        // Create the RPC function creator
        const createFunctionResult = await supabase.rpc('create_stored_procedure', {
          procedure_name: 'create_execute_sql_function',
          procedure_definition: `
          CREATE OR REPLACE FUNCTION create_execute_sql_function()
          RETURNS void AS $$
          BEGIN
            -- Check if the function already exists
            IF NOT EXISTS (
              SELECT 1 FROM pg_proc p
              JOIN pg_namespace n ON p.pronamespace = n.oid
              WHERE n.nspname = 'public' AND p.proname = 'execute_sql'
            ) THEN
              -- Create the execute_sql function
              EXECUTE '
                CREATE OR REPLACE FUNCTION public.execute_sql(query text)
                RETURNS SETOF json AS $$
                DECLARE
                  result json;
                  query_result refcursor;
                  rec record;
                BEGIN
                  -- Open a cursor for the dynamic query
                  OPEN query_result FOR EXECUTE query;
                  
                  -- Fetch each row and convert to JSON
                  LOOP
                    FETCH query_result INTO rec;
                    EXIT WHEN NOT FOUND;
                    
                    -- Convert the record to JSON and return it
                    result := to_json(rec);
                    RETURN NEXT result;
                  END LOOP;
                  
                  -- Close the cursor
                  CLOSE query_result;
                  RETURN;
                END;
                $$ LANGUAGE plpgsql SECURITY DEFINER;
                
                -- Grant execute permission to authenticated users
                GRANT EXECUTE ON FUNCTION public.execute_sql(text) TO authenticated;
                GRANT EXECUTE ON FUNCTION public.execute_sql(text) TO service_role;
              ';
            END IF;
          END;
          $$ LANGUAGE plpgsql;
          `
        });
        
        if (createFunctionResult.error) {
          return NextResponse.json({ 
            error: 'Failed to create function creator', 
            details: createFunctionResult.error 
          }, { status: 500 });
        }
        
        // Now execute the function creator
        const { error: execError } = await supabase.rpc('create_execute_sql_function', {});
        
        if (execError) {
          return NextResponse.json({ 
            error: 'Failed to create execute_sql function', 
            details: execError 
          }, { status: 500 });
        }
      }
    }
    
    return NextResponse.json({ success: true, message: 'SQL execution function is ready' });
  } catch (error) {
    console.error('Server error creating SQL execution function:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
