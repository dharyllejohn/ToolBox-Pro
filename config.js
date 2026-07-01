/* ==========================================
   TOOLBOX CONFIG (FIXED)
========================================== */

// Supabase
const SUPABASE_URL = "https://fdttfybluvhxrceakzkb.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZkdHRmeWJsdXZoeHJjZWFremtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI0OTg2MTYsImV4cCI6MjA5ODA3NDYxNn0.puEkhgnY3HpD64Sp09RMM0dqhbjQETF1WNkd4t7gieo";

// Global Supabase Client
const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);

// Tables
const PROFILE_TABLE = "profiles";
const NOTIFICATION_TABLE = "notifications";

// Root Pages
const LOGIN_PAGE = "auth.html";
const HOME_PAGE = "index.html";
const DASHBOARD_PAGE = "dashboard.html";

// Pages Folder
const UPGRADE_PAGE = "pages/upgrade.html";
const HISTORY_PAGE = "pages/resume-history.html";

// App
const APP_NAME = "ToolBox Pro";
const APP_VERSION = "1.0.0";