const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://jfeefinununbzpykwrzp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmZWVmaW51bnVuYnpweWt3cnpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY1MDE2NTQsImV4cCI6MjA5MjA3NzY1NH0.6LpouUWAYtvnsCicuVVx7UgaZOEDPVw4cVG-IGCADBM';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data: offers, error: err1 } = await supabase.from('investment_offers').select('*').limit(1);
  console.log('OFFER ROW:', offers, err1);

  const { data: user_investments, error: err2 } = await supabase.from('user_investments').select('*').limit(1);
  console.log('INVESTMENTS ROW:', user_investments, err2);

  const { data: transactions, error: err3 } = await supabase.from('transactions').select('*').limit(1);
  console.log('TRANSACTION ROW:', transactions, err3);
}

test();
