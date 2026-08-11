const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jfeefinununbzpykwrzp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZWVmaW51bnVuYnpweWt3cnpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MDE2NTQsImV4cCI6MjA5MjA3NzY1NH0.6LpouUWAYtvnsCicuVVx7UgaZOEDPVw4cVG-IGCADBM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: data1, error: error1 } = await supabase.from('user_investments').select('shares').limit(1);
  console.log('Query shares:', data1, error1);

  const { data: data2, error: error2 } = await supabase.from('user_investments').select('shares_bought').limit(1);
  console.log('Query shares_bought:', data2, error2);
}

test();
