angular
  .module('pharmacyApp.services')
  .factory('supabaseService', [
    function () {
      var SUPABASE_URL = 'https://aqxorcsscxnlmqdrremx.supabase.co';
      var SUPABASE_ANON_KEY =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxeG9yY3NzY3hubG1xZHJyZW14Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI2Mzc3ODksImV4cCI6MjA4ODIxMzc4OX0.nJ3QxFx6McPAiOCRup6km9ZLEsZ5DKcUeTlhq_mGz3g';

      var client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

      return {
        client: client
      };
    }
  ]);

