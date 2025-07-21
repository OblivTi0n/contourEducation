--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.5 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP EVENT TRIGGER IF EXISTS "pgrst_drop_watch";
DROP EVENT TRIGGER IF EXISTS "pgrst_ddl_watch";
DROP EVENT TRIGGER IF EXISTS "issue_pg_net_access";
DROP EVENT TRIGGER IF EXISTS "issue_pg_graphql_access";
DROP EVENT TRIGGER IF EXISTS "issue_pg_cron_access";
DROP EVENT TRIGGER IF EXISTS "issue_graphql_placeholder";
DROP PUBLICATION IF EXISTS "supabase_realtime";
DROP POLICY IF EXISTS "Users can update their own profile" ON "public"."profiles";
DROP POLICY IF EXISTS "Tutors and Admins can update lessons" ON "public"."lessons";
DROP POLICY IF EXISTS "Tutors and Admins can delete lessons" ON "public"."lessons";
DROP POLICY IF EXISTS "Tutors and Admins can create lessons" ON "public"."lessons";
DROP POLICY IF EXISTS "Everyone can view lesson tutors" ON "public"."lesson_tutors";
DROP POLICY IF EXISTS "Everyone can view lesson students" ON "public"."lesson_students";
DROP POLICY IF EXISTS "Everyone can view all profiles" ON "public"."profiles";
DROP POLICY IF EXISTS "Everyone can view all lessons" ON "public"."lessons";
DROP POLICY IF EXISTS "Allow tutors to see enrolments for their subjects" ON "public"."enrolments";
DROP POLICY IF EXISTS "Allow students to see their own enrolments" ON "public"."enrolments";
DROP POLICY IF EXISTS "Allow authenticated users to view tutor assignments" ON "public"."tutor_subjects";
DROP POLICY IF EXISTS "Allow authenticated users to view rooms" ON "public"."rooms";
DROP POLICY IF EXISTS "Allow authenticated users to view campuses" ON "public"."campuses";
DROP POLICY IF EXISTS "Allow authenticated users to view all subjects" ON "public"."subjects";
DROP POLICY IF EXISTS "Allow admins to manage tutor assignments" ON "public"."tutor_subjects";
DROP POLICY IF EXISTS "Allow admins to manage subjects" ON "public"."subjects";
DROP POLICY IF EXISTS "Allow admins to manage rooms" ON "public"."rooms";
DROP POLICY IF EXISTS "Allow admins to manage campuses" ON "public"."campuses";
DROP POLICY IF EXISTS "Allow admins to manage all enrolments" ON "public"."enrolments";
DROP POLICY IF EXISTS "Admins can manage all profiles" ON "public"."profiles";
DROP POLICY IF EXISTS "Admins and Tutors can manage lesson tutors" ON "public"."lesson_tutors";
DROP POLICY IF EXISTS "Admins and Tutors can manage lesson students" ON "public"."lesson_students";
ALTER TABLE IF EXISTS ONLY "storage"."s3_multipart_uploads_parts" DROP CONSTRAINT IF EXISTS "s3_multipart_uploads_parts_upload_id_fkey";
ALTER TABLE IF EXISTS ONLY "storage"."s3_multipart_uploads_parts" DROP CONSTRAINT IF EXISTS "s3_multipart_uploads_parts_bucket_id_fkey";
ALTER TABLE IF EXISTS ONLY "storage"."s3_multipart_uploads" DROP CONSTRAINT IF EXISTS "s3_multipart_uploads_bucket_id_fkey";
ALTER TABLE IF EXISTS ONLY "storage"."objects" DROP CONSTRAINT IF EXISTS "objects_bucketId_fkey";
ALTER TABLE IF EXISTS ONLY "public"."tutor_subjects" DROP CONSTRAINT IF EXISTS "tutor_subjects_tutor_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."tutor_subjects" DROP CONSTRAINT IF EXISTS "tutor_subjects_subject_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."rooms" DROP CONSTRAINT IF EXISTS "rooms_campus_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."profiles" DROP CONSTRAINT IF EXISTS "profiles_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."lessons" DROP CONSTRAINT IF EXISTS "lessons_subject_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."lessons" DROP CONSTRAINT IF EXISTS "lessons_room_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."lessons" DROP CONSTRAINT IF EXISTS "lessons_created_by_fkey";
ALTER TABLE IF EXISTS ONLY "public"."lessons" DROP CONSTRAINT IF EXISTS "lessons_campus_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."lesson_tutors" DROP CONSTRAINT IF EXISTS "lesson_tutors_tutor_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."lesson_tutors" DROP CONSTRAINT IF EXISTS "lesson_tutors_lesson_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."lesson_students" DROP CONSTRAINT IF EXISTS "lesson_students_student_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."lesson_students" DROP CONSTRAINT IF EXISTS "lesson_students_lesson_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."enrolments" DROP CONSTRAINT IF EXISTS "enrolments_subject_id_fkey";
ALTER TABLE IF EXISTS ONLY "public"."enrolments" DROP CONSTRAINT IF EXISTS "enrolments_student_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."sso_domains" DROP CONSTRAINT IF EXISTS "sso_domains_sso_provider_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."sessions" DROP CONSTRAINT IF EXISTS "sessions_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."saml_relay_states" DROP CONSTRAINT IF EXISTS "saml_relay_states_sso_provider_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."saml_relay_states" DROP CONSTRAINT IF EXISTS "saml_relay_states_flow_state_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."saml_providers" DROP CONSTRAINT IF EXISTS "saml_providers_sso_provider_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."refresh_tokens" DROP CONSTRAINT IF EXISTS "refresh_tokens_session_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."one_time_tokens" DROP CONSTRAINT IF EXISTS "one_time_tokens_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_factors" DROP CONSTRAINT IF EXISTS "mfa_factors_user_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_challenges" DROP CONSTRAINT IF EXISTS "mfa_challenges_auth_factor_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_amr_claims" DROP CONSTRAINT IF EXISTS "mfa_amr_claims_session_id_fkey";
ALTER TABLE IF EXISTS ONLY "auth"."identities" DROP CONSTRAINT IF EXISTS "identities_user_id_fkey";
DROP TRIGGER IF EXISTS "update_objects_updated_at" ON "storage"."objects";
DROP TRIGGER IF EXISTS "tr_check_filters" ON "realtime"."subscription";
DROP INDEX IF EXISTS "storage"."name_prefix_search";
DROP INDEX IF EXISTS "storage"."idx_objects_bucket_id_name";
DROP INDEX IF EXISTS "storage"."idx_multipart_uploads_list";
DROP INDEX IF EXISTS "storage"."bucketid_objname";
DROP INDEX IF EXISTS "storage"."bname";
DROP INDEX IF EXISTS "realtime"."subscription_subscription_id_entity_filters_key";
DROP INDEX IF EXISTS "realtime"."ix_realtime_subscription_entity";
DROP INDEX IF EXISTS "auth"."users_is_anonymous_idx";
DROP INDEX IF EXISTS "auth"."users_instance_id_idx";
DROP INDEX IF EXISTS "auth"."users_instance_id_email_idx";
DROP INDEX IF EXISTS "auth"."users_email_partial_key";
DROP INDEX IF EXISTS "auth"."user_id_created_at_idx";
DROP INDEX IF EXISTS "auth"."unique_phone_factor_per_user";
DROP INDEX IF EXISTS "auth"."sso_providers_resource_id_idx";
DROP INDEX IF EXISTS "auth"."sso_domains_sso_provider_id_idx";
DROP INDEX IF EXISTS "auth"."sso_domains_domain_idx";
DROP INDEX IF EXISTS "auth"."sessions_user_id_idx";
DROP INDEX IF EXISTS "auth"."sessions_not_after_idx";
DROP INDEX IF EXISTS "auth"."saml_relay_states_sso_provider_id_idx";
DROP INDEX IF EXISTS "auth"."saml_relay_states_for_email_idx";
DROP INDEX IF EXISTS "auth"."saml_relay_states_created_at_idx";
DROP INDEX IF EXISTS "auth"."saml_providers_sso_provider_id_idx";
DROP INDEX IF EXISTS "auth"."refresh_tokens_updated_at_idx";
DROP INDEX IF EXISTS "auth"."refresh_tokens_session_id_revoked_idx";
DROP INDEX IF EXISTS "auth"."refresh_tokens_parent_idx";
DROP INDEX IF EXISTS "auth"."refresh_tokens_instance_id_user_id_idx";
DROP INDEX IF EXISTS "auth"."refresh_tokens_instance_id_idx";
DROP INDEX IF EXISTS "auth"."recovery_token_idx";
DROP INDEX IF EXISTS "auth"."reauthentication_token_idx";
DROP INDEX IF EXISTS "auth"."one_time_tokens_user_id_token_type_key";
DROP INDEX IF EXISTS "auth"."one_time_tokens_token_hash_hash_idx";
DROP INDEX IF EXISTS "auth"."one_time_tokens_relates_to_hash_idx";
DROP INDEX IF EXISTS "auth"."mfa_factors_user_id_idx";
DROP INDEX IF EXISTS "auth"."mfa_factors_user_friendly_name_unique";
DROP INDEX IF EXISTS "auth"."mfa_challenge_created_at_idx";
DROP INDEX IF EXISTS "auth"."idx_user_id_auth_method";
DROP INDEX IF EXISTS "auth"."idx_auth_code";
DROP INDEX IF EXISTS "auth"."identities_user_id_idx";
DROP INDEX IF EXISTS "auth"."identities_email_idx";
DROP INDEX IF EXISTS "auth"."flow_state_created_at_idx";
DROP INDEX IF EXISTS "auth"."factor_id_created_at_idx";
DROP INDEX IF EXISTS "auth"."email_change_token_new_idx";
DROP INDEX IF EXISTS "auth"."email_change_token_current_idx";
DROP INDEX IF EXISTS "auth"."confirmation_token_idx";
DROP INDEX IF EXISTS "auth"."audit_logs_instance_id_idx";
ALTER TABLE IF EXISTS ONLY "supabase_migrations"."schema_migrations" DROP CONSTRAINT IF EXISTS "schema_migrations_pkey";
ALTER TABLE IF EXISTS ONLY "supabase_migrations"."schema_migrations" DROP CONSTRAINT IF EXISTS "schema_migrations_idempotency_key_key";
ALTER TABLE IF EXISTS ONLY "storage"."s3_multipart_uploads" DROP CONSTRAINT IF EXISTS "s3_multipart_uploads_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."s3_multipart_uploads_parts" DROP CONSTRAINT IF EXISTS "s3_multipart_uploads_parts_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."objects" DROP CONSTRAINT IF EXISTS "objects_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."migrations" DROP CONSTRAINT IF EXISTS "migrations_pkey";
ALTER TABLE IF EXISTS ONLY "storage"."migrations" DROP CONSTRAINT IF EXISTS "migrations_name_key";
ALTER TABLE IF EXISTS ONLY "storage"."buckets" DROP CONSTRAINT IF EXISTS "buckets_pkey";
ALTER TABLE IF EXISTS ONLY "realtime"."schema_migrations" DROP CONSTRAINT IF EXISTS "schema_migrations_pkey";
ALTER TABLE IF EXISTS ONLY "realtime"."subscription" DROP CONSTRAINT IF EXISTS "pk_subscription";
ALTER TABLE IF EXISTS ONLY "realtime"."messages" DROP CONSTRAINT IF EXISTS "messages_pkey";
ALTER TABLE IF EXISTS ONLY "public"."rooms" DROP CONSTRAINT IF EXISTS "unique_room_per_campus";
ALTER TABLE IF EXISTS ONLY "public"."tutor_subjects" DROP CONSTRAINT IF EXISTS "tutor_subjects_pkey";
ALTER TABLE IF EXISTS ONLY "public"."subjects" DROP CONSTRAINT IF EXISTS "subjects_pkey";
ALTER TABLE IF EXISTS ONLY "public"."subjects" DROP CONSTRAINT IF EXISTS "subjects_code_key";
ALTER TABLE IF EXISTS ONLY "public"."rooms" DROP CONSTRAINT IF EXISTS "rooms_pkey";
ALTER TABLE IF EXISTS ONLY "public"."profiles" DROP CONSTRAINT IF EXISTS "profiles_pkey";
ALTER TABLE IF EXISTS ONLY "public"."lessons" DROP CONSTRAINT IF EXISTS "lessons_pkey";
ALTER TABLE IF EXISTS ONLY "public"."lesson_tutors" DROP CONSTRAINT IF EXISTS "lesson_tutors_pkey";
ALTER TABLE IF EXISTS ONLY "public"."lesson_students" DROP CONSTRAINT IF EXISTS "lesson_students_pkey";
ALTER TABLE IF EXISTS ONLY "public"."enrolments" DROP CONSTRAINT IF EXISTS "enrolments_pkey";
ALTER TABLE IF EXISTS ONLY "public"."campuses" DROP CONSTRAINT IF EXISTS "campuses_pkey";
ALTER TABLE IF EXISTS ONLY "public"."campuses" DROP CONSTRAINT IF EXISTS "campuses_name_key";
ALTER TABLE IF EXISTS ONLY "auth"."users" DROP CONSTRAINT IF EXISTS "users_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."users" DROP CONSTRAINT IF EXISTS "users_phone_key";
ALTER TABLE IF EXISTS ONLY "auth"."sso_providers" DROP CONSTRAINT IF EXISTS "sso_providers_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."sso_domains" DROP CONSTRAINT IF EXISTS "sso_domains_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."sessions" DROP CONSTRAINT IF EXISTS "sessions_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."schema_migrations" DROP CONSTRAINT IF EXISTS "schema_migrations_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."saml_relay_states" DROP CONSTRAINT IF EXISTS "saml_relay_states_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."saml_providers" DROP CONSTRAINT IF EXISTS "saml_providers_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."saml_providers" DROP CONSTRAINT IF EXISTS "saml_providers_entity_id_key";
ALTER TABLE IF EXISTS ONLY "auth"."refresh_tokens" DROP CONSTRAINT IF EXISTS "refresh_tokens_token_unique";
ALTER TABLE IF EXISTS ONLY "auth"."refresh_tokens" DROP CONSTRAINT IF EXISTS "refresh_tokens_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."one_time_tokens" DROP CONSTRAINT IF EXISTS "one_time_tokens_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_factors" DROP CONSTRAINT IF EXISTS "mfa_factors_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_factors" DROP CONSTRAINT IF EXISTS "mfa_factors_last_challenged_at_key";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_challenges" DROP CONSTRAINT IF EXISTS "mfa_challenges_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_amr_claims" DROP CONSTRAINT IF EXISTS "mfa_amr_claims_session_id_authentication_method_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."instances" DROP CONSTRAINT IF EXISTS "instances_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."identities" DROP CONSTRAINT IF EXISTS "identities_provider_id_provider_unique";
ALTER TABLE IF EXISTS ONLY "auth"."identities" DROP CONSTRAINT IF EXISTS "identities_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."flow_state" DROP CONSTRAINT IF EXISTS "flow_state_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."audit_log_entries" DROP CONSTRAINT IF EXISTS "audit_log_entries_pkey";
ALTER TABLE IF EXISTS ONLY "auth"."mfa_amr_claims" DROP CONSTRAINT IF EXISTS "amr_id_pk";
ALTER TABLE IF EXISTS "auth"."refresh_tokens" ALTER COLUMN "id" DROP DEFAULT;
DROP TABLE IF EXISTS "supabase_migrations"."schema_migrations";
DROP TABLE IF EXISTS "storage"."s3_multipart_uploads_parts";
DROP TABLE IF EXISTS "storage"."s3_multipart_uploads";
DROP TABLE IF EXISTS "storage"."objects";
DROP TABLE IF EXISTS "storage"."migrations";
DROP TABLE IF EXISTS "storage"."buckets";
DROP TABLE IF EXISTS "realtime"."subscription";
DROP TABLE IF EXISTS "realtime"."schema_migrations";
DROP TABLE IF EXISTS "realtime"."messages";
DROP TABLE IF EXISTS "public"."tutor_subjects";
DROP TABLE IF EXISTS "public"."subjects";
DROP TABLE IF EXISTS "public"."rooms";
DROP TABLE IF EXISTS "public"."profiles";
DROP TABLE IF EXISTS "public"."lessons";
DROP TABLE IF EXISTS "public"."lesson_tutors";
DROP TABLE IF EXISTS "public"."lesson_students";
DROP TABLE IF EXISTS "public"."enrolments";
DROP TABLE IF EXISTS "public"."campuses";
DROP TABLE IF EXISTS "auth"."users";
DROP TABLE IF EXISTS "auth"."sso_providers";
DROP TABLE IF EXISTS "auth"."sso_domains";
DROP TABLE IF EXISTS "auth"."sessions";
DROP TABLE IF EXISTS "auth"."schema_migrations";
DROP TABLE IF EXISTS "auth"."saml_relay_states";
DROP TABLE IF EXISTS "auth"."saml_providers";
DROP SEQUENCE IF EXISTS "auth"."refresh_tokens_id_seq";
DROP TABLE IF EXISTS "auth"."refresh_tokens";
DROP TABLE IF EXISTS "auth"."one_time_tokens";
DROP TABLE IF EXISTS "auth"."mfa_factors";
DROP TABLE IF EXISTS "auth"."mfa_challenges";
DROP TABLE IF EXISTS "auth"."mfa_amr_claims";
DROP TABLE IF EXISTS "auth"."instances";
DROP TABLE IF EXISTS "auth"."identities";
DROP TABLE IF EXISTS "auth"."flow_state";
DROP TABLE IF EXISTS "auth"."audit_log_entries";
DROP FUNCTION IF EXISTS "storage"."update_updated_at_column"();
DROP FUNCTION IF EXISTS "storage"."search"("prefix" "text", "bucketname" "text", "limits" integer, "levels" integer, "offsets" integer, "search" "text", "sortcolumn" "text", "sortorder" "text");
DROP FUNCTION IF EXISTS "storage"."operation"();
DROP FUNCTION IF EXISTS "storage"."list_objects_with_delimiter"("bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer, "start_after" "text", "next_token" "text");
DROP FUNCTION IF EXISTS "storage"."list_multipart_uploads_with_delimiter"("bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer, "next_key_token" "text", "next_upload_token" "text");
DROP FUNCTION IF EXISTS "storage"."get_size_by_bucket"();
DROP FUNCTION IF EXISTS "storage"."foldername"("name" "text");
DROP FUNCTION IF EXISTS "storage"."filename"("name" "text");
DROP FUNCTION IF EXISTS "storage"."extension"("name" "text");
DROP FUNCTION IF EXISTS "storage"."can_insert_object"("bucketid" "text", "name" "text", "owner" "uuid", "metadata" "jsonb");
DROP FUNCTION IF EXISTS "realtime"."topic"();
DROP FUNCTION IF EXISTS "realtime"."to_regrole"("role_name" "text");
DROP FUNCTION IF EXISTS "realtime"."subscription_check_filters"();
DROP FUNCTION IF EXISTS "realtime"."send"("payload" "jsonb", "event" "text", "topic" "text", "private" boolean);
DROP FUNCTION IF EXISTS "realtime"."quote_wal2json"("entity" "regclass");
DROP FUNCTION IF EXISTS "realtime"."list_changes"("publication" "name", "slot_name" "name", "max_changes" integer, "max_record_bytes" integer);
DROP FUNCTION IF EXISTS "realtime"."is_visible_through_filters"("columns" "realtime"."wal_column"[], "filters" "realtime"."user_defined_filter"[]);
DROP FUNCTION IF EXISTS "realtime"."check_equality_op"("op" "realtime"."equality_op", "type_" "regtype", "val_1" "text", "val_2" "text");
DROP FUNCTION IF EXISTS "realtime"."cast"("val" "text", "type_" "regtype");
DROP FUNCTION IF EXISTS "realtime"."build_prepared_statement_sql"("prepared_statement_name" "text", "entity" "regclass", "columns" "realtime"."wal_column"[]);
DROP FUNCTION IF EXISTS "realtime"."broadcast_changes"("topic_name" "text", "event_name" "text", "operation" "text", "table_name" "text", "table_schema" "text", "new" "record", "old" "record", "level" "text");
DROP FUNCTION IF EXISTS "realtime"."apply_rls"("wal" "jsonb", "max_record_bytes" integer);
DROP FUNCTION IF EXISTS "public"."is_admin"();
DROP FUNCTION IF EXISTS "public"."get_my_role"();
DROP FUNCTION IF EXISTS "public"."custom_access_token_hook"("event" "jsonb");
DROP FUNCTION IF EXISTS "pgbouncer"."get_auth"("p_usename" "text");
DROP FUNCTION IF EXISTS "extensions"."set_graphql_placeholder"();
DROP FUNCTION IF EXISTS "extensions"."pgrst_drop_watch"();
DROP FUNCTION IF EXISTS "extensions"."pgrst_ddl_watch"();
DROP FUNCTION IF EXISTS "extensions"."grant_pg_net_access"();
DROP FUNCTION IF EXISTS "extensions"."grant_pg_graphql_access"();
DROP FUNCTION IF EXISTS "extensions"."grant_pg_cron_access"();
DROP FUNCTION IF EXISTS "auth"."uid"();
DROP FUNCTION IF EXISTS "auth"."role"();
DROP FUNCTION IF EXISTS "auth"."jwt"();
DROP FUNCTION IF EXISTS "auth"."email"();
DROP TYPE IF EXISTS "realtime"."wal_rls";
DROP TYPE IF EXISTS "realtime"."wal_column";
DROP TYPE IF EXISTS "realtime"."user_defined_filter";
DROP TYPE IF EXISTS "realtime"."equality_op";
DROP TYPE IF EXISTS "realtime"."action";
DROP TYPE IF EXISTS "public"."user_role";
DROP TYPE IF EXISTS "public"."lesson_status";
DROP TYPE IF EXISTS "public"."enrolment_status";
DROP TYPE IF EXISTS "auth"."one_time_token_type";
DROP TYPE IF EXISTS "auth"."factor_type";
DROP TYPE IF EXISTS "auth"."factor_status";
DROP TYPE IF EXISTS "auth"."code_challenge_method";
DROP TYPE IF EXISTS "auth"."aal_level";
DROP EXTENSION IF EXISTS "uuid-ossp";
DROP EXTENSION IF EXISTS "supabase_vault";
DROP EXTENSION IF EXISTS "pgcrypto";
DROP EXTENSION IF EXISTS "pg_stat_statements";
DROP EXTENSION IF EXISTS "pg_graphql";
DROP SCHEMA IF EXISTS "vault";
DROP SCHEMA IF EXISTS "supabase_migrations";
DROP SCHEMA IF EXISTS "storage";
DROP SCHEMA IF EXISTS "realtime";
DROP SCHEMA IF EXISTS "pgbouncer";
DROP SCHEMA IF EXISTS "graphql_public";
DROP SCHEMA IF EXISTS "graphql";
DROP SCHEMA IF EXISTS "extensions";
DROP SCHEMA IF EXISTS "auth";
--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "auth";


--
-- Name: extensions; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "extensions";


--
-- Name: graphql; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "graphql";


--
-- Name: graphql_public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "graphql_public";


--
-- Name: pgbouncer; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "pgbouncer";


--
-- Name: SCHEMA "public"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA "public" IS 'standard public schema';


--
-- Name: realtime; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "realtime";


--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "storage";


--
-- Name: supabase_migrations; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "supabase_migrations";


--
-- Name: vault; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "vault";


--
-- Name: pg_graphql; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";


--
-- Name: EXTENSION "pg_graphql"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "pg_graphql" IS 'pg_graphql: GraphQL support';


--
-- Name: pg_stat_statements; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";


--
-- Name: EXTENSION "pg_stat_statements"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "pg_stat_statements" IS 'track planning and execution statistics of all SQL statements executed';


--
-- Name: pgcrypto; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";


--
-- Name: EXTENSION "pgcrypto"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "pgcrypto" IS 'cryptographic functions';


--
-- Name: supabase_vault; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";


--
-- Name: EXTENSION "supabase_vault"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "supabase_vault" IS 'Supabase Vault Extension';


--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."aal_level" AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."code_challenge_method" AS ENUM (
    's256',
    'plain'
);


--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."factor_status" AS ENUM (
    'unverified',
    'verified'
);


--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."factor_type" AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE "auth"."one_time_token_type" AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


--
-- Name: enrolment_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE "public"."enrolment_status" AS ENUM (
    'active',
    'completed',
    'dropped'
);


--
-- Name: lesson_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE "public"."lesson_status" AS ENUM (
    'scheduled',
    'completed',
    'cancelled'
);


--
-- Name: user_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE "public"."user_role" AS ENUM (
    'student',
    'tutor',
    'admin'
);


--
-- Name: action; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE "realtime"."action" AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'TRUNCATE',
    'ERROR'
);


--
-- Name: equality_op; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE "realtime"."equality_op" AS ENUM (
    'eq',
    'neq',
    'lt',
    'lte',
    'gt',
    'gte',
    'in'
);


--
-- Name: user_defined_filter; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE "realtime"."user_defined_filter" AS (
	"column_name" "text",
	"op" "realtime"."equality_op",
	"value" "text"
);


--
-- Name: wal_column; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE "realtime"."wal_column" AS (
	"name" "text",
	"type_name" "text",
	"type_oid" "oid",
	"value" "jsonb",
	"is_pkey" boolean,
	"is_selectable" boolean
);


--
-- Name: wal_rls; Type: TYPE; Schema: realtime; Owner: -
--

CREATE TYPE "realtime"."wal_rls" AS (
	"wal" "jsonb",
	"is_rls_enabled" boolean,
	"subscription_ids" "uuid"[],
	"errors" "text"[]
);


--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION "auth"."email"() RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


--
-- Name: FUNCTION "email"(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION "auth"."email"() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION "auth"."jwt"() RETURNS "jsonb"
    LANGUAGE "sql" STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION "auth"."role"() RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


--
-- Name: FUNCTION "role"(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION "auth"."role"() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION "auth"."uid"() RETURNS "uuid"
    LANGUAGE "sql" STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


--
-- Name: FUNCTION "uid"(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION "auth"."uid"() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: grant_pg_cron_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION "extensions"."grant_pg_cron_access"() RETURNS "event_trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF EXISTS (
    SELECT
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_cron'
  )
  THEN
    grant usage on schema cron to postgres with grant option;

    alter default privileges in schema cron grant all on tables to postgres with grant option;
    alter default privileges in schema cron grant all on functions to postgres with grant option;
    alter default privileges in schema cron grant all on sequences to postgres with grant option;

    alter default privileges for user supabase_admin in schema cron grant all
        on sequences to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on tables to postgres with grant option;
    alter default privileges for user supabase_admin in schema cron grant all
        on functions to postgres with grant option;

    grant all privileges on all tables in schema cron to postgres with grant option;
    revoke all on table cron.job from postgres;
    grant select on table cron.job to postgres with grant option;
  END IF;
END;
$$;


--
-- Name: FUNCTION "grant_pg_cron_access"(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION "extensions"."grant_pg_cron_access"() IS 'Grants access to pg_cron';


--
-- Name: grant_pg_graphql_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION "extensions"."grant_pg_graphql_access"() RETURNS "event_trigger"
    LANGUAGE "plpgsql"
    AS $_$
DECLARE
    func_is_graphql_resolve bool;
BEGIN
    func_is_graphql_resolve = (
        SELECT n.proname = 'resolve'
        FROM pg_event_trigger_ddl_commands() AS ev
        LEFT JOIN pg_catalog.pg_proc AS n
        ON ev.objid = n.oid
    );

    IF func_is_graphql_resolve
    THEN
        -- Update public wrapper to pass all arguments through to the pg_graphql resolve func
        DROP FUNCTION IF EXISTS graphql_public.graphql;
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language sql
        as $$
            select graphql.resolve(
                query := query,
                variables := coalesce(variables, '{}'),
                "operationName" := "operationName",
                extensions := extensions
            );
        $$;

        -- This hook executes when `graphql.resolve` is created. That is not necessarily the last
        -- function in the extension so we need to grant permissions on existing entities AND
        -- update default permissions to any others that are created after `graphql.resolve`
        grant usage on schema graphql to postgres, anon, authenticated, service_role;
        grant select on all tables in schema graphql to postgres, anon, authenticated, service_role;
        grant execute on all functions in schema graphql to postgres, anon, authenticated, service_role;
        grant all on all sequences in schema graphql to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on tables to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on functions to postgres, anon, authenticated, service_role;
        alter default privileges in schema graphql grant all on sequences to postgres, anon, authenticated, service_role;

        -- Allow postgres role to allow granting usage on graphql and graphql_public schemas to custom roles
        grant usage on schema graphql_public to postgres with grant option;
        grant usage on schema graphql to postgres with grant option;
    END IF;

END;
$_$;


--
-- Name: FUNCTION "grant_pg_graphql_access"(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION "extensions"."grant_pg_graphql_access"() IS 'Grants access to pg_graphql';


--
-- Name: grant_pg_net_access(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION "extensions"."grant_pg_net_access"() RETURNS "event_trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_event_trigger_ddl_commands() AS ev
    JOIN pg_extension AS ext
    ON ev.objid = ext.oid
    WHERE ext.extname = 'pg_net'
  )
  THEN
    IF NOT EXISTS (
      SELECT 1
      FROM pg_roles
      WHERE rolname = 'supabase_functions_admin'
    )
    THEN
      CREATE USER supabase_functions_admin NOINHERIT CREATEROLE LOGIN NOREPLICATION;
    END IF;

    GRANT USAGE ON SCHEMA net TO supabase_functions_admin, postgres, anon, authenticated, service_role;

    IF EXISTS (
      SELECT FROM pg_extension
      WHERE extname = 'pg_net'
      -- all versions in use on existing projects as of 2025-02-20
      -- version 0.12.0 onwards don't need these applied
      AND extversion IN ('0.2', '0.6', '0.7', '0.7.1', '0.8', '0.10.0', '0.11.0')
    ) THEN
      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SECURITY DEFINER;

      ALTER function net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;
      ALTER function net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) SET search_path = net;

      REVOKE ALL ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;
      REVOKE ALL ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) FROM PUBLIC;

      GRANT EXECUTE ON FUNCTION net.http_get(url text, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
      GRANT EXECUTE ON FUNCTION net.http_post(url text, body jsonb, params jsonb, headers jsonb, timeout_milliseconds integer) TO supabase_functions_admin, postgres, anon, authenticated, service_role;
    END IF;
  END IF;
END;
$$;


--
-- Name: FUNCTION "grant_pg_net_access"(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION "extensions"."grant_pg_net_access"() IS 'Grants access to pg_net';


--
-- Name: pgrst_ddl_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION "extensions"."pgrst_ddl_watch"() RETURNS "event_trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN SELECT * FROM pg_event_trigger_ddl_commands()
  LOOP
    IF cmd.command_tag IN (
      'CREATE SCHEMA', 'ALTER SCHEMA'
    , 'CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO', 'ALTER TABLE'
    , 'CREATE FOREIGN TABLE', 'ALTER FOREIGN TABLE'
    , 'CREATE VIEW', 'ALTER VIEW'
    , 'CREATE MATERIALIZED VIEW', 'ALTER MATERIALIZED VIEW'
    , 'CREATE FUNCTION', 'ALTER FUNCTION'
    , 'CREATE TRIGGER'
    , 'CREATE TYPE', 'ALTER TYPE'
    , 'CREATE RULE'
    , 'COMMENT'
    )
    -- don't notify in case of CREATE TEMP table or other objects created on pg_temp
    AND cmd.schema_name is distinct from 'pg_temp'
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: pgrst_drop_watch(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION "extensions"."pgrst_drop_watch"() RETURNS "event_trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  obj record;
BEGIN
  FOR obj IN SELECT * FROM pg_event_trigger_dropped_objects()
  LOOP
    IF obj.object_type IN (
      'schema'
    , 'table'
    , 'foreign table'
    , 'view'
    , 'materialized view'
    , 'function'
    , 'trigger'
    , 'type'
    , 'rule'
    )
    AND obj.is_temporary IS false -- no pg_temp objects
    THEN
      NOTIFY pgrst, 'reload schema';
    END IF;
  END LOOP;
END; $$;


--
-- Name: set_graphql_placeholder(); Type: FUNCTION; Schema: extensions; Owner: -
--

CREATE FUNCTION "extensions"."set_graphql_placeholder"() RETURNS "event_trigger"
    LANGUAGE "plpgsql"
    AS $_$
    DECLARE
    graphql_is_dropped bool;
    BEGIN
    graphql_is_dropped = (
        SELECT ev.schema_name = 'graphql_public'
        FROM pg_event_trigger_dropped_objects() AS ev
        WHERE ev.schema_name = 'graphql_public'
    );

    IF graphql_is_dropped
    THEN
        create or replace function graphql_public.graphql(
            "operationName" text default null,
            query text default null,
            variables jsonb default null,
            extensions jsonb default null
        )
            returns jsonb
            language plpgsql
        as $$
            DECLARE
                server_version float;
            BEGIN
                server_version = (SELECT (SPLIT_PART((select version()), ' ', 2))::float);

                IF server_version >= 14 THEN
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql extension is not enabled.'
                            )
                        )
                    );
                ELSE
                    RETURN jsonb_build_object(
                        'errors', jsonb_build_array(
                            jsonb_build_object(
                                'message', 'pg_graphql is only available on projects running Postgres 14 onwards.'
                            )
                        )
                    );
                END IF;
            END;
        $$;
    END IF;

    END;
$_$;


--
-- Name: FUNCTION "set_graphql_placeholder"(); Type: COMMENT; Schema: extensions; Owner: -
--

COMMENT ON FUNCTION "extensions"."set_graphql_placeholder"() IS 'Reintroduces placeholder function for graphql_public.graphql';


--
-- Name: get_auth("text"); Type: FUNCTION; Schema: pgbouncer; Owner: -
--

CREATE FUNCTION "pgbouncer"."get_auth"("p_usename" "text") RETURNS TABLE("username" "text", "password" "text")
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $_$
begin
    raise debug 'PgBouncer auth request: %', p_usename;

    return query
    select 
        rolname::text, 
        case when rolvaliduntil < now() 
            then null 
            else rolpassword::text 
        end 
    from pg_authid 
    where rolname=$1 and rolcanlogin;
end;
$_$;


--
-- Name: custom_access_token_hook("jsonb"); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."custom_access_token_hook"("event" "jsonb") RETURNS "jsonb"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
  declare
    claims jsonb;
    user_role text;
  begin
    -- Extract the existing claims
    claims := event->'claims';
    
    -- Get the user's role from the profiles table
    select role into user_role
    from public.profiles
    where id = (event->>'user_id')::uuid;
    
    -- If we found a role, add it to the claims
    if user_role is not null then
      claims := jsonb_set(claims, '{user_role}', to_jsonb(user_role));
    end if;
    
    -- Return the updated claims
    return jsonb_build_object('claims', claims);
  end;
$$;


--
-- Name: get_my_role(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."get_my_role"() RETURNS "text"
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  SELECT role::text FROM profiles WHERE id = auth.uid();
$$;


--
-- Name: is_admin(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION "public"."is_admin"() RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    AS $$
  SELECT get_my_role() = 'admin';
$$;


--
-- Name: apply_rls("jsonb", integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."apply_rls"("wal" "jsonb", "max_record_bytes" integer DEFAULT (1024 * 1024)) RETURNS SETOF "realtime"."wal_rls"
    LANGUAGE "plpgsql"
    AS $$
declare
-- Regclass of the table e.g. public.notes
entity_ regclass = (quote_ident(wal ->> 'schema') || '.' || quote_ident(wal ->> 'table'))::regclass;

-- I, U, D, T: insert, update ...
action realtime.action = (
    case wal ->> 'action'
        when 'I' then 'INSERT'
        when 'U' then 'UPDATE'
        when 'D' then 'DELETE'
        else 'ERROR'
    end
);

-- Is row level security enabled for the table
is_rls_enabled bool = relrowsecurity from pg_class where oid = entity_;

subscriptions realtime.subscription[] = array_agg(subs)
    from
        realtime.subscription subs
    where
        subs.entity = entity_;

-- Subscription vars
roles regrole[] = array_agg(distinct us.claims_role::text)
    from
        unnest(subscriptions) us;

working_role regrole;
claimed_role regrole;
claims jsonb;

subscription_id uuid;
subscription_has_access bool;
visible_to_subscription_ids uuid[] = '{}';

-- structured info for wal's columns
columns realtime.wal_column[];
-- previous identity values for update/delete
old_columns realtime.wal_column[];

error_record_exceeds_max_size boolean = octet_length(wal::text) > max_record_bytes;

-- Primary jsonb output for record
output jsonb;

begin
perform set_config('role', null, true);

columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'columns') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

old_columns =
    array_agg(
        (
            x->>'name',
            x->>'type',
            x->>'typeoid',
            realtime.cast(
                (x->'value') #>> '{}',
                coalesce(
                    (x->>'typeoid')::regtype, -- null when wal2json version <= 2.4
                    (x->>'type')::regtype
                )
            ),
            (pks ->> 'name') is not null,
            true
        )::realtime.wal_column
    )
    from
        jsonb_array_elements(wal -> 'identity') x
        left join jsonb_array_elements(wal -> 'pk') pks
            on (x ->> 'name') = (pks ->> 'name');

for working_role in select * from unnest(roles) loop

    -- Update `is_selectable` for columns and old_columns
    columns =
        array_agg(
            (
                c.name,
                c.type_name,
                c.type_oid,
                c.value,
                c.is_pkey,
                pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
            )::realtime.wal_column
        )
        from
            unnest(columns) c;

    old_columns =
            array_agg(
                (
                    c.name,
                    c.type_name,
                    c.type_oid,
                    c.value,
                    c.is_pkey,
                    pg_catalog.has_column_privilege(working_role, entity_, c.name, 'SELECT')
                )::realtime.wal_column
            )
            from
                unnest(old_columns) c;

    if action <> 'DELETE' and count(1) = 0 from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            -- subscriptions is already filtered by entity
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 400: Bad Request, no primary key']
        )::realtime.wal_rls;

    -- The claims role does not have SELECT permission to the primary key of entity
    elsif action <> 'DELETE' and sum(c.is_selectable::int) <> count(1) from unnest(columns) c where c.is_pkey then
        return next (
            jsonb_build_object(
                'schema', wal ->> 'schema',
                'table', wal ->> 'table',
                'type', action
            ),
            is_rls_enabled,
            (select array_agg(s.subscription_id) from unnest(subscriptions) as s where claims_role = working_role),
            array['Error 401: Unauthorized']
        )::realtime.wal_rls;

    else
        output = jsonb_build_object(
            'schema', wal ->> 'schema',
            'table', wal ->> 'table',
            'type', action,
            'commit_timestamp', to_char(
                ((wal ->> 'timestamp')::timestamptz at time zone 'utc'),
                'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"'
            ),
            'columns', (
                select
                    jsonb_agg(
                        jsonb_build_object(
                            'name', pa.attname,
                            'type', pt.typname
                        )
                        order by pa.attnum asc
                    )
                from
                    pg_attribute pa
                    join pg_type pt
                        on pa.atttypid = pt.oid
                where
                    attrelid = entity_
                    and attnum > 0
                    and pg_catalog.has_column_privilege(working_role, entity_, pa.attname, 'SELECT')
            )
        )
        -- Add "record" key for insert and update
        || case
            when action in ('INSERT', 'UPDATE') then
                jsonb_build_object(
                    'record',
                    (
                        select
                            jsonb_object_agg(
                                -- if unchanged toast, get column name and value from old record
                                coalesce((c).name, (oc).name),
                                case
                                    when (c).name is null then (oc).value
                                    else (c).value
                                end
                            )
                        from
                            unnest(columns) c
                            full outer join unnest(old_columns) oc
                                on (c).name = (oc).name
                        where
                            coalesce((c).is_selectable, (oc).is_selectable)
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                    )
                )
            else '{}'::jsonb
        end
        -- Add "old_record" key for update and delete
        || case
            when action = 'UPDATE' then
                jsonb_build_object(
                        'old_record',
                        (
                            select jsonb_object_agg((c).name, (c).value)
                            from unnest(old_columns) c
                            where
                                (c).is_selectable
                                and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                        )
                    )
            when action = 'DELETE' then
                jsonb_build_object(
                    'old_record',
                    (
                        select jsonb_object_agg((c).name, (c).value)
                        from unnest(old_columns) c
                        where
                            (c).is_selectable
                            and ( not error_record_exceeds_max_size or (octet_length((c).value::text) <= 64))
                            and ( not is_rls_enabled or (c).is_pkey ) -- if RLS enabled, we can't secure deletes so filter to pkey
                    )
                )
            else '{}'::jsonb
        end;

        -- Create the prepared statement
        if is_rls_enabled and action <> 'DELETE' then
            if (select 1 from pg_prepared_statements where name = 'walrus_rls_stmt' limit 1) > 0 then
                deallocate walrus_rls_stmt;
            end if;
            execute realtime.build_prepared_statement_sql('walrus_rls_stmt', entity_, columns);
        end if;

        visible_to_subscription_ids = '{}';

        for subscription_id, claims in (
                select
                    subs.subscription_id,
                    subs.claims
                from
                    unnest(subscriptions) subs
                where
                    subs.entity = entity_
                    and subs.claims_role = working_role
                    and (
                        realtime.is_visible_through_filters(columns, subs.filters)
                        or (
                          action = 'DELETE'
                          and realtime.is_visible_through_filters(old_columns, subs.filters)
                        )
                    )
        ) loop

            if not is_rls_enabled or action = 'DELETE' then
                visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
            else
                -- Check if RLS allows the role to see the record
                perform
                    -- Trim leading and trailing quotes from working_role because set_config
                    -- doesn't recognize the role as valid if they are included
                    set_config('role', trim(both '"' from working_role::text), true),
                    set_config('request.jwt.claims', claims::text, true);

                execute 'execute walrus_rls_stmt' into subscription_has_access;

                if subscription_has_access then
                    visible_to_subscription_ids = visible_to_subscription_ids || subscription_id;
                end if;
            end if;
        end loop;

        perform set_config('role', null, true);

        return next (
            output,
            is_rls_enabled,
            visible_to_subscription_ids,
            case
                when error_record_exceeds_max_size then array['Error 413: Payload Too Large']
                else '{}'
            end
        )::realtime.wal_rls;

    end if;
end loop;

perform set_config('role', null, true);
end;
$$;


--
-- Name: broadcast_changes("text", "text", "text", "text", "text", "record", "record", "text"); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."broadcast_changes"("topic_name" "text", "event_name" "text", "operation" "text", "table_name" "text", "table_schema" "text", "new" "record", "old" "record", "level" "text" DEFAULT 'ROW'::"text") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
    -- Declare a variable to hold the JSONB representation of the row
    row_data jsonb := '{}'::jsonb;
BEGIN
    IF level = 'STATEMENT' THEN
        RAISE EXCEPTION 'function can only be triggered for each row, not for each statement';
    END IF;
    -- Check the operation type and handle accordingly
    IF operation = 'INSERT' OR operation = 'UPDATE' OR operation = 'DELETE' THEN
        row_data := jsonb_build_object('old_record', OLD, 'record', NEW, 'operation', operation, 'table', table_name, 'schema', table_schema);
        PERFORM realtime.send (row_data, event_name, topic_name);
    ELSE
        RAISE EXCEPTION 'Unexpected operation type: %', operation;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Failed to process the row: %', SQLERRM;
END;

$$;


--
-- Name: build_prepared_statement_sql("text", "regclass", "realtime"."wal_column"[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."build_prepared_statement_sql"("prepared_statement_name" "text", "entity" "regclass", "columns" "realtime"."wal_column"[]) RETURNS "text"
    LANGUAGE "sql"
    AS $$
      /*
      Builds a sql string that, if executed, creates a prepared statement to
      tests retrive a row from *entity* by its primary key columns.
      Example
          select realtime.build_prepared_statement_sql('public.notes', '{"id"}'::text[], '{"bigint"}'::text[])
      */
          select
      'prepare ' || prepared_statement_name || ' as
          select
              exists(
                  select
                      1
                  from
                      ' || entity || '
                  where
                      ' || string_agg(quote_ident(pkc.name) || '=' || quote_nullable(pkc.value #>> '{}') , ' and ') || '
              )'
          from
              unnest(columns) pkc
          where
              pkc.is_pkey
          group by
              entity
      $$;


--
-- Name: cast("text", "regtype"); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."cast"("val" "text", "type_" "regtype") RETURNS "jsonb"
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
    declare
      res jsonb;
    begin
      execute format('select to_jsonb(%L::'|| type_::text || ')', val)  into res;
      return res;
    end
    $$;


--
-- Name: check_equality_op("realtime"."equality_op", "regtype", "text", "text"); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."check_equality_op"("op" "realtime"."equality_op", "type_" "regtype", "val_1" "text", "val_2" "text") RETURNS boolean
    LANGUAGE "plpgsql" IMMUTABLE
    AS $$
      /*
      Casts *val_1* and *val_2* as type *type_* and check the *op* condition for truthiness
      */
      declare
          op_symbol text = (
              case
                  when op = 'eq' then '='
                  when op = 'neq' then '!='
                  when op = 'lt' then '<'
                  when op = 'lte' then '<='
                  when op = 'gt' then '>'
                  when op = 'gte' then '>='
                  when op = 'in' then '= any'
                  else 'UNKNOWN OP'
              end
          );
          res boolean;
      begin
          execute format(
              'select %L::'|| type_::text || ' ' || op_symbol
              || ' ( %L::'
              || (
                  case
                      when op = 'in' then type_::text || '[]'
                      else type_::text end
              )
              || ')', val_1, val_2) into res;
          return res;
      end;
      $$;


--
-- Name: is_visible_through_filters("realtime"."wal_column"[], "realtime"."user_defined_filter"[]); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."is_visible_through_filters"("columns" "realtime"."wal_column"[], "filters" "realtime"."user_defined_filter"[]) RETURNS boolean
    LANGUAGE "sql" IMMUTABLE
    AS $_$
    /*
    Should the record be visible (true) or filtered out (false) after *filters* are applied
    */
        select
            -- Default to allowed when no filters present
            $2 is null -- no filters. this should not happen because subscriptions has a default
            or array_length($2, 1) is null -- array length of an empty array is null
            or bool_and(
                coalesce(
                    realtime.check_equality_op(
                        op:=f.op,
                        type_:=coalesce(
                            col.type_oid::regtype, -- null when wal2json version <= 2.4
                            col.type_name::regtype
                        ),
                        -- cast jsonb to text
                        val_1:=col.value #>> '{}',
                        val_2:=f.value
                    ),
                    false -- if null, filter does not match
                )
            )
        from
            unnest(filters) f
            join unnest(columns) col
                on f.column_name = col.name;
    $_$;


--
-- Name: list_changes("name", "name", integer, integer); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."list_changes"("publication" "name", "slot_name" "name", "max_changes" integer, "max_record_bytes" integer) RETURNS SETOF "realtime"."wal_rls"
    LANGUAGE "sql"
    SET "log_min_messages" TO 'fatal'
    AS $$
      with pub as (
        select
          concat_ws(
            ',',
            case when bool_or(pubinsert) then 'insert' else null end,
            case when bool_or(pubupdate) then 'update' else null end,
            case when bool_or(pubdelete) then 'delete' else null end
          ) as w2j_actions,
          coalesce(
            string_agg(
              realtime.quote_wal2json(format('%I.%I', schemaname, tablename)::regclass),
              ','
            ) filter (where ppt.tablename is not null and ppt.tablename not like '% %'),
            ''
          ) w2j_add_tables
        from
          pg_publication pp
          left join pg_publication_tables ppt
            on pp.pubname = ppt.pubname
        where
          pp.pubname = publication
        group by
          pp.pubname
        limit 1
      ),
      w2j as (
        select
          x.*, pub.w2j_add_tables
        from
          pub,
          pg_logical_slot_get_changes(
            slot_name, null, max_changes,
            'include-pk', 'true',
            'include-transaction', 'false',
            'include-timestamp', 'true',
            'include-type-oids', 'true',
            'format-version', '2',
            'actions', pub.w2j_actions,
            'add-tables', pub.w2j_add_tables
          ) x
      )
      select
        xyz.wal,
        xyz.is_rls_enabled,
        xyz.subscription_ids,
        xyz.errors
      from
        w2j,
        realtime.apply_rls(
          wal := w2j.data::jsonb,
          max_record_bytes := max_record_bytes
        ) xyz(wal, is_rls_enabled, subscription_ids, errors)
      where
        w2j.w2j_add_tables <> ''
        and xyz.subscription_ids[1] is not null
    $$;


--
-- Name: quote_wal2json("regclass"); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."quote_wal2json"("entity" "regclass") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE STRICT
    AS $$
      select
        (
          select string_agg('' || ch,'')
          from unnest(string_to_array(nsp.nspname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
        )
        || '.'
        || (
          select string_agg('' || ch,'')
          from unnest(string_to_array(pc.relname::text, null)) with ordinality x(ch, idx)
          where
            not (x.idx = 1 and x.ch = '"')
            and not (
              x.idx = array_length(string_to_array(nsp.nspname::text, null), 1)
              and x.ch = '"'
            )
          )
      from
        pg_class pc
        join pg_namespace nsp
          on pc.relnamespace = nsp.oid
      where
        pc.oid = entity
    $$;


--
-- Name: send("jsonb", "text", "text", boolean); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."send"("payload" "jsonb", "event" "text", "topic" "text", "private" boolean DEFAULT true) RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  BEGIN
    -- Set the topic configuration
    EXECUTE format('SET LOCAL realtime.topic TO %L', topic);

    -- Attempt to insert the message
    INSERT INTO realtime.messages (payload, event, topic, private, extension)
    VALUES (payload, event, topic, private, 'broadcast');
  EXCEPTION
    WHEN OTHERS THEN
      -- Capture and notify the error
      RAISE WARNING 'ErrorSendingBroadcastMessage: %', SQLERRM;
  END;
END;
$$;


--
-- Name: subscription_check_filters(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."subscription_check_filters"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
    /*
    Validates that the user defined filters for a subscription:
    - refer to valid columns that the claimed role may access
    - values are coercable to the correct column type
    */
    declare
        col_names text[] = coalesce(
                array_agg(c.column_name order by c.ordinal_position),
                '{}'::text[]
            )
            from
                information_schema.columns c
            where
                format('%I.%I', c.table_schema, c.table_name)::regclass = new.entity
                and pg_catalog.has_column_privilege(
                    (new.claims ->> 'role'),
                    format('%I.%I', c.table_schema, c.table_name)::regclass,
                    c.column_name,
                    'SELECT'
                );
        filter realtime.user_defined_filter;
        col_type regtype;

        in_val jsonb;
    begin
        for filter in select * from unnest(new.filters) loop
            -- Filtered column is valid
            if not filter.column_name = any(col_names) then
                raise exception 'invalid column for filter %', filter.column_name;
            end if;

            -- Type is sanitized and safe for string interpolation
            col_type = (
                select atttypid::regtype
                from pg_catalog.pg_attribute
                where attrelid = new.entity
                      and attname = filter.column_name
            );
            if col_type is null then
                raise exception 'failed to lookup type for column %', filter.column_name;
            end if;

            -- Set maximum number of entries for in filter
            if filter.op = 'in'::realtime.equality_op then
                in_val = realtime.cast(filter.value, (col_type::text || '[]')::regtype);
                if coalesce(jsonb_array_length(in_val), 0) > 100 then
                    raise exception 'too many values for `in` filter. Maximum 100';
                end if;
            else
                -- raises an exception if value is not coercable to type
                perform realtime.cast(filter.value, col_type);
            end if;

        end loop;

        -- Apply consistent order to filters so the unique constraint on
        -- (subscription_id, entity, filters) can't be tricked by a different filter order
        new.filters = coalesce(
            array_agg(f order by f.column_name, f.op, f.value),
            '{}'
        ) from unnest(new.filters) f;

        return new;
    end;
    $$;


--
-- Name: to_regrole("text"); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."to_regrole"("role_name" "text") RETURNS "regrole"
    LANGUAGE "sql" IMMUTABLE
    AS $$ select role_name::regrole $$;


--
-- Name: topic(); Type: FUNCTION; Schema: realtime; Owner: -
--

CREATE FUNCTION "realtime"."topic"() RETURNS "text"
    LANGUAGE "sql" STABLE
    AS $$
select nullif(current_setting('realtime.topic', true), '')::text;
$$;


--
-- Name: can_insert_object("text", "text", "uuid", "jsonb"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."can_insert_object"("bucketid" "text", "name" "text", "owner" "uuid", "metadata" "jsonb") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


--
-- Name: extension("text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."extension"("name" "text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
_parts text[];
_filename text;
BEGIN
	select string_to_array(name, '/') into _parts;
	select _parts[array_length(_parts,1)] into _filename;
	-- @todo return the last part instead of 2
	return reverse(split_part(reverse(_filename), '.', 1));
END
$$;


--
-- Name: filename("text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."filename"("name" "text") RETURNS "text"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


--
-- Name: foldername("text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."foldername"("name" "text") RETURNS "text"[]
    LANGUAGE "plpgsql"
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[1:array_length(_parts,1)-1];
END
$$;


--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."get_size_by_bucket"() RETURNS TABLE("size" bigint, "bucket_id" "text")
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


--
-- Name: list_multipart_uploads_with_delimiter("text", "text", "text", integer, "text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."list_multipart_uploads_with_delimiter"("bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer DEFAULT 100, "next_key_token" "text" DEFAULT ''::"text", "next_upload_token" "text" DEFAULT ''::"text") RETURNS TABLE("key" "text", "id" "text", "created_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


--
-- Name: list_objects_with_delimiter("text", "text", "text", integer, "text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."list_objects_with_delimiter"("bucket_id" "text", "prefix_param" "text", "delimiter_param" "text", "max_keys" integer DEFAULT 100, "start_after" "text" DEFAULT ''::"text", "next_token" "text" DEFAULT ''::"text") RETURNS TABLE("name" "text", "id" "uuid", "metadata" "jsonb", "updated_at" timestamp with time zone)
    LANGUAGE "plpgsql"
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."operation"() RETURNS "text"
    LANGUAGE "plpgsql" STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


--
-- Name: search("text", "text", integer, integer, integer, "text", "text", "text"); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."search"("prefix" "text", "bucketname" "text", "limits" integer DEFAULT 100, "levels" integer DEFAULT 1, "offsets" integer DEFAULT 0, "search" "text" DEFAULT ''::"text", "sortcolumn" "text" DEFAULT 'name'::"text", "sortorder" "text" DEFAULT 'asc'::"text") RETURNS TABLE("name" "text", "id" "uuid", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" "jsonb")
    LANGUAGE "plpgsql" STABLE
    AS $_$
declare
  v_order_by text;
  v_sort_order text;
begin
  case
    when sortcolumn = 'name' then
      v_order_by = 'name';
    when sortcolumn = 'updated_at' then
      v_order_by = 'updated_at';
    when sortcolumn = 'created_at' then
      v_order_by = 'created_at';
    when sortcolumn = 'last_accessed_at' then
      v_order_by = 'last_accessed_at';
    else
      v_order_by = 'name';
  end case;

  case
    when sortorder = 'asc' then
      v_sort_order = 'asc';
    when sortorder = 'desc' then
      v_sort_order = 'desc';
    else
      v_sort_order = 'asc';
  end case;

  v_order_by = v_order_by || ' ' || v_sort_order;

  return query execute
    'with folders as (
       select path_tokens[$1] as folder
       from storage.objects
         where objects.name ilike $2 || $3 || ''%''
           and bucket_id = $4
           and array_length(objects.path_tokens, 1) <> $1
       group by folder
       order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION "storage"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."audit_log_entries" (
    "instance_id" "uuid",
    "id" "uuid" NOT NULL,
    "payload" json,
    "created_at" timestamp with time zone,
    "ip_address" character varying(64) DEFAULT ''::character varying NOT NULL
);


--
-- Name: TABLE "audit_log_entries"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."audit_log_entries" IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."flow_state" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid",
    "auth_code" "text" NOT NULL,
    "code_challenge_method" "auth"."code_challenge_method" NOT NULL,
    "code_challenge" "text" NOT NULL,
    "provider_type" "text" NOT NULL,
    "provider_access_token" "text",
    "provider_refresh_token" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "authentication_method" "text" NOT NULL,
    "auth_code_issued_at" timestamp with time zone
);


--
-- Name: TABLE "flow_state"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."flow_state" IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."identities" (
    "provider_id" "text" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "identity_data" "jsonb" NOT NULL,
    "provider" "text" NOT NULL,
    "last_sign_in_at" timestamp with time zone,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "email" "text" GENERATED ALWAYS AS ("lower"(("identity_data" ->> 'email'::"text"))) STORED,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
);


--
-- Name: TABLE "identities"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."identities" IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN "identities"."email"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."identities"."email" IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."instances" (
    "id" "uuid" NOT NULL,
    "uuid" "uuid",
    "raw_base_config" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone
);


--
-- Name: TABLE "instances"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."instances" IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."mfa_amr_claims" (
    "session_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "authentication_method" "text" NOT NULL,
    "id" "uuid" NOT NULL
);


--
-- Name: TABLE "mfa_amr_claims"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."mfa_amr_claims" IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."mfa_challenges" (
    "id" "uuid" NOT NULL,
    "factor_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "verified_at" timestamp with time zone,
    "ip_address" "inet" NOT NULL,
    "otp_code" "text",
    "web_authn_session_data" "jsonb"
);


--
-- Name: TABLE "mfa_challenges"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."mfa_challenges" IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."mfa_factors" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "friendly_name" "text",
    "factor_type" "auth"."factor_type" NOT NULL,
    "status" "auth"."factor_status" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "secret" "text",
    "phone" "text",
    "last_challenged_at" timestamp with time zone,
    "web_authn_credential" "jsonb",
    "web_authn_aaguid" "uuid"
);


--
-- Name: TABLE "mfa_factors"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."mfa_factors" IS 'auth: stores metadata about factors';


--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."one_time_tokens" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "token_type" "auth"."one_time_token_type" NOT NULL,
    "token_hash" "text" NOT NULL,
    "relates_to" "text" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "one_time_tokens_token_hash_check" CHECK (("char_length"("token_hash") > 0))
);


--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."refresh_tokens" (
    "instance_id" "uuid",
    "id" bigint NOT NULL,
    "token" character varying(255),
    "user_id" character varying(255),
    "revoked" boolean,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "parent" character varying(255),
    "session_id" "uuid"
);


--
-- Name: TABLE "refresh_tokens"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."refresh_tokens" IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: -
--

CREATE SEQUENCE "auth"."refresh_tokens_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: -
--

ALTER SEQUENCE "auth"."refresh_tokens_id_seq" OWNED BY "auth"."refresh_tokens"."id";


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."saml_providers" (
    "id" "uuid" NOT NULL,
    "sso_provider_id" "uuid" NOT NULL,
    "entity_id" "text" NOT NULL,
    "metadata_xml" "text" NOT NULL,
    "metadata_url" "text",
    "attribute_mapping" "jsonb",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "name_id_format" "text",
    CONSTRAINT "entity_id not empty" CHECK (("char_length"("entity_id") > 0)),
    CONSTRAINT "metadata_url not empty" CHECK ((("metadata_url" = NULL::"text") OR ("char_length"("metadata_url") > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK (("char_length"("metadata_xml") > 0))
);


--
-- Name: TABLE "saml_providers"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."saml_providers" IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."saml_relay_states" (
    "id" "uuid" NOT NULL,
    "sso_provider_id" "uuid" NOT NULL,
    "request_id" "text" NOT NULL,
    "for_email" "text",
    "redirect_to" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "flow_state_id" "uuid",
    CONSTRAINT "request_id not empty" CHECK (("char_length"("request_id") > 0))
);


--
-- Name: TABLE "saml_relay_states"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."saml_relay_states" IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."schema_migrations" (
    "version" character varying(255) NOT NULL
);


--
-- Name: TABLE "schema_migrations"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."schema_migrations" IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."sessions" (
    "id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "factor_id" "uuid",
    "aal" "auth"."aal_level",
    "not_after" timestamp with time zone,
    "refreshed_at" timestamp without time zone,
    "user_agent" "text",
    "ip" "inet",
    "tag" "text"
);


--
-- Name: TABLE "sessions"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."sessions" IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN "sessions"."not_after"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."sessions"."not_after" IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."sso_domains" (
    "id" "uuid" NOT NULL,
    "sso_provider_id" "uuid" NOT NULL,
    "domain" "text" NOT NULL,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK (("char_length"("domain") > 0))
);


--
-- Name: TABLE "sso_domains"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."sso_domains" IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."sso_providers" (
    "id" "uuid" NOT NULL,
    "resource_id" "text",
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    CONSTRAINT "resource_id not empty" CHECK ((("resource_id" = NULL::"text") OR ("char_length"("resource_id") > 0)))
);


--
-- Name: TABLE "sso_providers"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."sso_providers" IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN "sso_providers"."resource_id"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."sso_providers"."resource_id" IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE "auth"."users" (
    "instance_id" "uuid",
    "id" "uuid" NOT NULL,
    "aud" character varying(255),
    "role" character varying(255),
    "email" character varying(255),
    "encrypted_password" character varying(255),
    "email_confirmed_at" timestamp with time zone,
    "invited_at" timestamp with time zone,
    "confirmation_token" character varying(255),
    "confirmation_sent_at" timestamp with time zone,
    "recovery_token" character varying(255),
    "recovery_sent_at" timestamp with time zone,
    "email_change_token_new" character varying(255),
    "email_change" character varying(255),
    "email_change_sent_at" timestamp with time zone,
    "last_sign_in_at" timestamp with time zone,
    "raw_app_meta_data" "jsonb",
    "raw_user_meta_data" "jsonb",
    "is_super_admin" boolean,
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "phone" "text" DEFAULT NULL::character varying,
    "phone_confirmed_at" timestamp with time zone,
    "phone_change" "text" DEFAULT ''::character varying,
    "phone_change_token" character varying(255) DEFAULT ''::character varying,
    "phone_change_sent_at" timestamp with time zone,
    "confirmed_at" timestamp with time zone GENERATED ALWAYS AS (LEAST("email_confirmed_at", "phone_confirmed_at")) STORED,
    "email_change_token_current" character varying(255) DEFAULT ''::character varying,
    "email_change_confirm_status" smallint DEFAULT 0,
    "banned_until" timestamp with time zone,
    "reauthentication_token" character varying(255) DEFAULT ''::character varying,
    "reauthentication_sent_at" timestamp with time zone,
    "is_sso_user" boolean DEFAULT false NOT NULL,
    "deleted_at" timestamp with time zone,
    "is_anonymous" boolean DEFAULT false NOT NULL,
    CONSTRAINT "users_email_change_confirm_status_check" CHECK ((("email_change_confirm_status" >= 0) AND ("email_change_confirm_status" <= 2)))
);


--
-- Name: TABLE "users"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE "auth"."users" IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN "users"."is_sso_user"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN "auth"."users"."is_sso_user" IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: campuses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."campuses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "address" "text",
    "google_maps_link" "text",
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


--
-- Name: TABLE "campuses"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE "public"."campuses" IS 'Stores the high-level physical campus locations.';


--
-- Name: COLUMN "campuses"."google_maps_link"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."campuses"."google_maps_link" IS 'An optional link to the Google Maps location for the campus.';


--
-- Name: enrolments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."enrolments" (
    "student_id" "uuid" NOT NULL,
    "subject_id" "uuid" NOT NULL,
    "enrol_date" "date" DEFAULT CURRENT_DATE,
    "status" "public"."enrolment_status" DEFAULT 'active'::"public"."enrolment_status"
);


--
-- Name: TABLE "enrolments"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE "public"."enrolments" IS 'Tracks which student is enrolled in which subject.';


--
-- Name: lesson_students; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."lesson_students" (
    "lesson_id" "uuid" NOT NULL,
    "student_id" "uuid" NOT NULL
);


--
-- Name: TABLE "lesson_students"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE "public"."lesson_students" IS 'Assigns students to specific lessons.';


--
-- Name: lesson_tutors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."lesson_tutors" (
    "lesson_id" "uuid" NOT NULL,
    "tutor_id" "uuid" NOT NULL
);


--
-- Name: TABLE "lesson_tutors"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE "public"."lesson_tutors" IS 'Assigns tutors to specific lessons.';


--
-- Name: lessons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."lessons" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "subject_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "start_time" timestamp with time zone NOT NULL,
    "end_time" timestamp with time zone NOT NULL,
    "location" "text",
    "status" "public"."lesson_status" DEFAULT 'scheduled'::"public"."lesson_status",
    "created_by" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "campus_id" "uuid",
    "room_id" "uuid",
    "location_detail" "text"
);


--
-- Name: TABLE "lessons"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE "public"."lessons" IS 'Represents a single scheduled tutoring session.';


--
-- Name: COLUMN "lessons"."campus_id"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."lessons"."campus_id" IS 'A foreign key to the physical campus. Primarily used for filtering. NULL if the lesson is online.';


--
-- Name: COLUMN "lessons"."room_id"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."lessons"."room_id" IS 'A foreign key to the specific room where the lesson is held. NULL if the lesson is online.';


--
-- Name: COLUMN "lessons"."location_detail"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."lessons"."location_detail" IS 'Stores the full online meeting URL. This field should ONLY be used for online lessons.';


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."profiles" (
    "id" "uuid" NOT NULL,
    "first_name" "text",
    "last_name" "text",
    "role" "public"."user_role" NOT NULL,
    "contact_email" "text",
    "phone_number" "text",
    "avatar_url" "text",
    "school_name" "text",
    "vce_year_level" integer,
    "parent_guardian_name" "text",
    "parent_guardian_email" "text",
    "parent_guardian_phone" "text",
    "job_title" "text",
    "bio" "text",
    "qualifications" "jsonb",
    "emergency_contact_name" "text",
    "emergency_contact_phone" "text",
    "created_at" timestamp with time zone DEFAULT "now"()
);


--
-- Name: TABLE "profiles"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE "public"."profiles" IS 'Stores public-facing user data, roles, and role-specific attributes for students and staff.';


--
-- Name: rooms; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."rooms" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "campus_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "capacity" integer,
    "status" "text" DEFAULT 'active'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


--
-- Name: TABLE "rooms"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE "public"."rooms" IS 'Stores individual rooms available at each campus.';


--
-- Name: COLUMN "rooms"."campus_id"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN "public"."rooms"."campus_id" IS 'A foreign key linking the room to its parent campus.';


--
-- Name: subjects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."subjects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "code" "text" NOT NULL,
    "title" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


--
-- Name: TABLE "subjects"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE "public"."subjects" IS 'The official list of all VCE subjects offered.';


--
-- Name: tutor_subjects; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."tutor_subjects" (
    "tutor_id" "uuid" NOT NULL,
    "subject_id" "uuid" NOT NULL,
    "is_lead_tutor" boolean DEFAULT false,
    "assigned_at" timestamp with time zone DEFAULT "now"()
);


--
-- Name: TABLE "tutor_subjects"; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE "public"."tutor_subjects" IS 'Assigns tutors to subjects they are qualified to teach.';


--
-- Name: messages; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE "realtime"."messages" (
    "topic" "text" NOT NULL,
    "extension" "text" NOT NULL,
    "payload" "jsonb",
    "event" "text",
    "private" boolean DEFAULT false,
    "updated_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "inserted_at" timestamp without time zone DEFAULT "now"() NOT NULL,
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL
)
PARTITION BY RANGE ("inserted_at");


--
-- Name: schema_migrations; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE "realtime"."schema_migrations" (
    "version" bigint NOT NULL,
    "inserted_at" timestamp(0) without time zone
);


--
-- Name: subscription; Type: TABLE; Schema: realtime; Owner: -
--

CREATE TABLE "realtime"."subscription" (
    "id" bigint NOT NULL,
    "subscription_id" "uuid" NOT NULL,
    "entity" "regclass" NOT NULL,
    "filters" "realtime"."user_defined_filter"[] DEFAULT '{}'::"realtime"."user_defined_filter"[] NOT NULL,
    "claims" "jsonb" NOT NULL,
    "claims_role" "regrole" GENERATED ALWAYS AS ("realtime"."to_regrole"(("claims" ->> 'role'::"text"))) STORED NOT NULL,
    "created_at" timestamp without time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


--
-- Name: subscription_id_seq; Type: SEQUENCE; Schema: realtime; Owner: -
--

ALTER TABLE "realtime"."subscription" ALTER COLUMN "id" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "realtime"."subscription_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."buckets" (
    "id" "text" NOT NULL,
    "name" "text" NOT NULL,
    "owner" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "public" boolean DEFAULT false,
    "avif_autodetection" boolean DEFAULT false,
    "file_size_limit" bigint,
    "allowed_mime_types" "text"[],
    "owner_id" "text"
);


--
-- Name: COLUMN "buckets"."owner"; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN "storage"."buckets"."owner" IS 'Field is deprecated, use owner_id instead';


--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."migrations" (
    "id" integer NOT NULL,
    "name" character varying(100) NOT NULL,
    "hash" character varying(40) NOT NULL,
    "executed_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: objects; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."objects" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "bucket_id" "text",
    "name" "text",
    "owner" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "last_accessed_at" timestamp with time zone DEFAULT "now"(),
    "metadata" "jsonb",
    "path_tokens" "text"[] GENERATED ALWAYS AS ("string_to_array"("name", '/'::"text")) STORED,
    "version" "text",
    "owner_id" "text",
    "user_metadata" "jsonb"
);


--
-- Name: COLUMN "objects"."owner"; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN "storage"."objects"."owner" IS 'Field is deprecated, use owner_id instead';


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."s3_multipart_uploads" (
    "id" "text" NOT NULL,
    "in_progress_size" bigint DEFAULT 0 NOT NULL,
    "upload_signature" "text" NOT NULL,
    "bucket_id" "text" NOT NULL,
    "key" "text" NOT NULL COLLATE "pg_catalog"."C",
    "version" "text" NOT NULL,
    "owner_id" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "user_metadata" "jsonb"
);


--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE "storage"."s3_multipart_uploads_parts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "upload_id" "text" NOT NULL,
    "size" bigint DEFAULT 0 NOT NULL,
    "part_number" integer NOT NULL,
    "bucket_id" "text" NOT NULL,
    "key" "text" NOT NULL COLLATE "pg_catalog"."C",
    "etag" "text" NOT NULL,
    "owner_id" "text",
    "version" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


--
-- Name: schema_migrations; Type: TABLE; Schema: supabase_migrations; Owner: -
--

CREATE TABLE "supabase_migrations"."schema_migrations" (
    "version" "text" NOT NULL,
    "statements" "text"[],
    "name" "text",
    "created_by" "text",
    "idempotency_key" "text"
);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."refresh_tokens" ALTER COLUMN "id" SET DEFAULT "nextval"('"auth"."refresh_tokens_id_seq"'::"regclass");


--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."audit_log_entries" ("instance_id", "id", "payload", "created_at", "ip_address") FROM stdin;
00000000-0000-0000-0000-000000000000	f981ea75-fbaa-459f-baae-840211124e73	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"admin@gmail.com","user_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","user_phone":""}}	2025-07-19 13:40:22.322352+00	
00000000-0000-0000-0000-000000000000	1367b78f-9cc8-47dc-96f8-467e1da77628	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-19 13:55:43.385717+00	
00000000-0000-0000-0000-000000000000	df7e2956-6974-4202-99b0-33027ca19f15	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-19 13:58:08.547943+00	
00000000-0000-0000-0000-000000000000	ba482290-546e-4c25-8d0b-fb1cdc611fa9	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-19 14:01:49.011988+00	
00000000-0000-0000-0000-000000000000	c47930e1-646e-4fe1-af77-88f60c04c85f	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-19 14:02:23.75631+00	
00000000-0000-0000-0000-000000000000	55417513-db50-4dd0-bf71-8820a09be5a1	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-19 14:21:04.346507+00	
00000000-0000-0000-0000-000000000000	04f37001-e326-498c-9c42-77d19fb8947e	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-19 15:05:48.668953+00	
00000000-0000-0000-0000-000000000000	0da7e38c-93c5-4e5c-851b-aae42916bc0a	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-19 15:20:04.0199+00	
00000000-0000-0000-0000-000000000000	ada4c2a3-5553-4a29-b426-eb0b859e200e	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-19 15:20:08.1535+00	
00000000-0000-0000-0000-000000000000	ba520366-28a2-47eb-8224-d929622e6037	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-19 15:20:25.439656+00	
00000000-0000-0000-0000-000000000000	33b21c96-54e0-4db3-8a12-01556fc6df4e	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-19 15:20:29.693263+00	
00000000-0000-0000-0000-000000000000	c0c17f64-68c6-445f-8c49-099fc0eecd9a	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-19 15:20:38.833291+00	
00000000-0000-0000-0000-000000000000	f554dc35-224e-46e4-8fc4-ba5740b3a6c1	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-19 15:22:11.382199+00	
00000000-0000-0000-0000-000000000000	9b8093a1-1063-4d11-a9fb-610857a4504d	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-19 15:22:54.393594+00	
00000000-0000-0000-0000-000000000000	0316b650-d517-49ec-ba15-9059363d3310	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-19 15:24:30.658995+00	
00000000-0000-0000-0000-000000000000	9d86584f-8ce4-460a-a4d7-29d514b195e6	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-19 15:24:46.269636+00	
00000000-0000-0000-0000-000000000000	16c92a1c-89f6-46ab-8dc9-5607e090149d	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-19 15:42:27.861682+00	
00000000-0000-0000-0000-000000000000	3d1cbcb5-8f4e-4003-95ec-14e1dfb74109	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-19 15:50:29.160104+00	
00000000-0000-0000-0000-000000000000	1529b2d1-e3f0-4d79-8b01-56195e6f608c	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-19 16:13:21.580654+00	
00000000-0000-0000-0000-000000000000	0eaf9e16-ef0a-44b7-b82c-8c990a9eba5a	{"action":"token_refreshed","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 06:05:47.802978+00	
00000000-0000-0000-0000-000000000000	4f4c3cb6-ced8-4061-b113-d94d7c40c59f	{"action":"token_revoked","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 06:05:47.812261+00	
00000000-0000-0000-0000-000000000000	fe353860-9901-42a9-869c-ee274440e1de	{"action":"token_refreshed","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 11:14:35.383026+00	
00000000-0000-0000-0000-000000000000	4a08eb82-0d6b-46d4-a607-3c4155c4b4c1	{"action":"token_revoked","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 11:14:35.387688+00	
00000000-0000-0000-0000-000000000000	5388950b-42af-49eb-8ff4-3bf79d32f468	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-20 11:15:55.140042+00	
00000000-0000-0000-0000-000000000000	d4094759-1196-4040-9b48-5ca1df3ed31a	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-20 11:42:44.45008+00	
00000000-0000-0000-0000-000000000000	971645d5-a388-402c-81b3-9e9da850334e	{"action":"logout","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-07-20 11:47:54.400092+00	
00000000-0000-0000-0000-000000000000	bcf6bd78-4dd4-472f-a3c9-667948acd6b5	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-20 11:48:07.286655+00	
00000000-0000-0000-0000-000000000000	31dfcdd5-751a-423c-9adc-547461345023	{"action":"logout","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-07-20 11:58:31.062002+00	
00000000-0000-0000-0000-000000000000	2abce82a-db0e-41b4-a7e4-c145b81ccf7d	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-20 11:58:59.551003+00	
00000000-0000-0000-0000-000000000000	9613615c-190c-4c0d-b108-ffc4918d9726	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-20 12:11:56.685368+00	
00000000-0000-0000-0000-000000000000	59bf5b5e-fef7-4c51-b905-ef3fd592e398	{"action":"logout","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-07-20 12:25:51.324566+00	
00000000-0000-0000-0000-000000000000	ce13df3c-8521-4437-bbf2-a0a7701d8cb5	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-20 12:25:57.170756+00	
00000000-0000-0000-0000-000000000000	7f0a407e-15da-4b6c-904c-bd6e943049bd	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-20 12:43:25.005475+00	
00000000-0000-0000-0000-000000000000	5d0337f3-9492-46cb-8cde-fc1946cbd9dd	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-20 12:45:10.625072+00	
00000000-0000-0000-0000-000000000000	6f1dfed6-2d33-4fd1-939d-977fe5382f2f	{"action":"token_refreshed","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 13:53:06.81345+00	
00000000-0000-0000-0000-000000000000	3d46d84e-17d8-48db-aa88-eb26c98e77da	{"action":"token_revoked","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 13:53:06.814208+00	
00000000-0000-0000-0000-000000000000	2b7d7a15-c90c-49d1-8449-8834faa4544d	{"action":"token_refreshed","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 13:53:07.055313+00	
00000000-0000-0000-0000-000000000000	bd945ada-f9ef-42f5-a89e-0344a8f93812	{"action":"token_refreshed","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 13:53:07.363496+00	
00000000-0000-0000-0000-000000000000	3a27db90-bc17-4e24-b2dd-8dadf78ef757	{"action":"logout","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-07-20 14:06:20.492819+00	
00000000-0000-0000-0000-000000000000	80a3686e-d80f-47bb-9a06-c2748d7f9065	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-20 14:06:31.735155+00	
00000000-0000-0000-0000-000000000000	0614c1d5-fecd-4561-9f71-10a7a4b63a86	{"action":"logout","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-07-20 14:16:23.681182+00	
00000000-0000-0000-0000-000000000000	6bc69e67-3ba4-43f2-b6a0-5c51c9190d3a	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-20 14:17:37.321678+00	
00000000-0000-0000-0000-000000000000	68fba5d7-3bcd-4527-8c96-98cfab4b5bdb	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"jane@gmail.com","user_id":"5549541e-5727-425c-9e78-d3811a8cfe41","user_phone":""}}	2025-07-20 15:05:08.905017+00	
00000000-0000-0000-0000-000000000000	c89647de-27dc-4a13-bda8-80c0f2b10639	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"john@gmail.com","user_id":"b60a1a5f-74dd-4b92-a223-2b80c1fd65e5","user_phone":""}}	2025-07-20 15:05:21.539243+00	
00000000-0000-0000-0000-000000000000	714bde7e-93bc-4ac4-a207-af45db1d78fd	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"philip@gmail.com","user_id":"8e9c3797-9514-4bfe-ae20-b571ded65bcf","user_phone":""}}	2025-07-20 15:05:36.514339+00	
00000000-0000-0000-0000-000000000000	c9af623a-26d2-4e7e-9fd2-641fff7d180f	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"mary@gmail.com","user_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","user_phone":""}}	2025-07-20 15:06:15.388485+00	
00000000-0000-0000-0000-000000000000	61f60d33-a7fd-48e1-b21e-4636f480348e	{"action":"token_refreshed","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 15:16:08.388524+00	
00000000-0000-0000-0000-000000000000	0530dc95-165e-4f2d-8f8b-6d3d2db09a9a	{"action":"token_revoked","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 15:16:08.389286+00	
00000000-0000-0000-0000-000000000000	6891073a-564c-4944-bb94-2c708c04a700	{"action":"logout","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-07-20 15:49:43.582946+00	
00000000-0000-0000-0000-000000000000	34518ec2-f053-4aeb-94c6-fbe5d221a077	{"action":"login","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-20 15:49:59.977407+00	
00000000-0000-0000-0000-000000000000	ab49f077-650d-467c-9801-1d6c99876562	{"action":"logout","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-07-20 16:29:00.021831+00	
00000000-0000-0000-0000-000000000000	dcd866eb-4734-4b54-8564-008ba734c672	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-20 16:29:10.133623+00	
00000000-0000-0000-0000-000000000000	7dc5829d-c49f-4c4e-8ca6-d8fc544e9ef5	{"action":"token_refreshed","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 17:27:12.504887+00	
00000000-0000-0000-0000-000000000000	44c25921-f6ff-4b76-a4cc-7d52f761e5a0	{"action":"token_revoked","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 17:27:12.505669+00	
00000000-0000-0000-0000-000000000000	5ae69703-d5a1-4380-b4ef-c2c594779376	{"action":"login","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-20 18:17:13.517562+00	
00000000-0000-0000-0000-000000000000	a7ef6d5a-d678-46dd-9f8c-a24f2c4bdc9e	{"action":"login","actor_id":"8e9c3797-9514-4bfe-ae20-b571ded65bcf","actor_username":"philip@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-20 18:17:40.925889+00	
00000000-0000-0000-0000-000000000000	29daca37-23c7-45d6-a664-8e5fe8b1d8eb	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-20 18:21:40.911153+00	
00000000-0000-0000-0000-000000000000	5d330710-58b2-4dcc-ba24-a22de82cf320	{"action":"login","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-20 18:22:19.578128+00	
00000000-0000-0000-0000-000000000000	f8122b79-cedf-415f-9904-5a336b38262a	{"action":"token_refreshed","actor_id":"8e9c3797-9514-4bfe-ae20-b571ded65bcf","actor_username":"philip@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:19:41.715195+00	
00000000-0000-0000-0000-000000000000	431fcaef-61cb-4aad-a24c-eb7bae880e10	{"action":"token_revoked","actor_id":"8e9c3797-9514-4bfe-ae20-b571ded65bcf","actor_username":"philip@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:19:41.717262+00	
00000000-0000-0000-0000-000000000000	84e583aa-1dbc-4c37-adcc-b5f758931086	{"action":"token_refreshed","actor_id":"8e9c3797-9514-4bfe-ae20-b571ded65bcf","actor_username":"philip@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:19:41.733234+00	
00000000-0000-0000-0000-000000000000	91f16d35-b616-468a-aec6-a60e47226658	{"action":"token_refreshed","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:20:17.368294+00	
00000000-0000-0000-0000-000000000000	116356df-826e-405d-81cc-f97108b788a4	{"action":"token_revoked","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:20:17.368906+00	
00000000-0000-0000-0000-000000000000	7dc5235f-e7d8-4bed-9c7c-5258b599dc61	{"action":"token_refreshed","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:20:17.400583+00	
00000000-0000-0000-0000-000000000000	c9e2ca42-f1d0-46d7-9eb0-2c1d9c59c3b6	{"action":"token_refreshed","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:21:14.617494+00	
00000000-0000-0000-0000-000000000000	3b55c790-6f64-4a5e-adae-34f12efad67e	{"action":"token_revoked","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:21:14.618056+00	
00000000-0000-0000-0000-000000000000	958f30d7-8582-4a39-9c94-59f0325ccff9	{"action":"token_refreshed","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:21:14.640333+00	
00000000-0000-0000-0000-000000000000	019147ac-df64-47bf-841a-b860b3103baa	{"action":"token_refreshed","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:21:14.671325+00	
00000000-0000-0000-0000-000000000000	2d161c4e-aa18-470c-aa2f-d19a11b83baf	{"action":"token_refreshed","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:21:14.689588+00	
00000000-0000-0000-0000-000000000000	88db5038-76b8-486b-b157-716d19851711	{"action":"token_refreshed","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:21:14.705293+00	
00000000-0000-0000-0000-000000000000	d22c4c8c-5cc9-4d6c-9fdc-e136d61fd081	{"action":"token_refreshed","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:21:14.727966+00	
00000000-0000-0000-0000-000000000000	592bfa20-0ebb-4216-8e9a-f97cfa9bd51e	{"action":"token_refreshed","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:21:14.750553+00	
00000000-0000-0000-0000-000000000000	750bb524-db10-461d-a78d-bc183ff23519	{"action":"token_refreshed","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:21:14.78449+00	
00000000-0000-0000-0000-000000000000	975681a1-cb3e-4d0b-af56-04038b2967c0	{"action":"token_refreshed","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:21:14.814765+00	
00000000-0000-0000-0000-000000000000	2fbc4fab-9d3c-4c78-a57f-e2a7159cbfc5	{"action":"token_refreshed","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:21:14.828147+00	
00000000-0000-0000-0000-000000000000	c306b8df-1887-48bc-a1ec-c9c95278b00b	{"action":"token_refreshed","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:21:14.839411+00	
00000000-0000-0000-0000-000000000000	b705cf27-f92d-4218-bd27-4e2f2e9c092a	{"action":"token_refreshed","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:21:14.849508+00	
00000000-0000-0000-0000-000000000000	e5a71610-7e9d-4f27-a336-b48ecd4ad583	{"action":"token_refreshed","actor_id":"8e9c3797-9514-4bfe-ae20-b571ded65bcf","actor_username":"philip@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:22:24.329021+00	
00000000-0000-0000-0000-000000000000	6e808a00-4eff-44ef-97b3-611b697b2f38	{"action":"token_refreshed","actor_id":"8e9c3797-9514-4bfe-ae20-b571ded65bcf","actor_username":"philip@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:22:24.346908+00	
00000000-0000-0000-0000-000000000000	e789d6ad-6a21-417b-bce4-d3066cdf9c10	{"action":"token_refreshed","actor_id":"8e9c3797-9514-4bfe-ae20-b571ded65bcf","actor_username":"philip@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:22:24.372533+00	
00000000-0000-0000-0000-000000000000	38ec41ac-0918-4bbc-89fe-447ba9c313cf	{"action":"token_refreshed","actor_id":"8e9c3797-9514-4bfe-ae20-b571ded65bcf","actor_username":"philip@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:22:24.402996+00	
00000000-0000-0000-0000-000000000000	002f01a9-8ad5-4a4e-8d27-bcfd320d8504	{"action":"token_refreshed","actor_id":"8e9c3797-9514-4bfe-ae20-b571ded65bcf","actor_username":"philip@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:22:24.857601+00	
00000000-0000-0000-0000-000000000000	dd6ebea2-2cca-49db-8a8b-9c38c69e5161	{"action":"token_refreshed","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:22:24.881165+00	
00000000-0000-0000-0000-000000000000	851ddc26-56d3-4c82-a157-7dc8023e31ff	{"action":"token_refreshed","actor_id":"8e9c3797-9514-4bfe-ae20-b571ded65bcf","actor_username":"philip@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:22:24.891926+00	
00000000-0000-0000-0000-000000000000	28ef1f64-a417-4034-9a34-0467fece90b1	{"action":"token_refreshed","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:22:24.907435+00	
00000000-0000-0000-0000-000000000000	c7b99fdf-4818-4354-9765-ee013c2256c9	{"action":"token_refreshed","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:22:25.110262+00	
00000000-0000-0000-0000-000000000000	b8d3d189-ad97-434c-9d4f-8393d7a930af	{"action":"token_refreshed","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:22:25.351326+00	
00000000-0000-0000-0000-000000000000	f8a63793-9687-4d0b-a444-4a1d402a59db	{"action":"token_refreshed","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:22:25.362461+00	
00000000-0000-0000-0000-000000000000	4b3192e9-0043-435e-9873-255bc7e3c371	{"action":"token_refreshed","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:22:25.393219+00	
00000000-0000-0000-0000-000000000000	0df98edc-fc5c-4306-a24a-184a2eff7c41	{"action":"token_refreshed","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:22:25.406397+00	
00000000-0000-0000-0000-000000000000	343c9cf3-6ac4-4858-98bc-f4705dfaf93f	{"action":"token_refreshed","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:22:25.432797+00	
00000000-0000-0000-0000-000000000000	921cbadd-3830-4ad6-9736-c5c27ac9fcae	{"action":"token_refreshed","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:22:25.716925+00	
00000000-0000-0000-0000-000000000000	9f7a6176-b93c-47ff-bd67-400211df9b53	{"action":"token_refreshed","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:22:25.907897+00	
00000000-0000-0000-0000-000000000000	37f39c29-d15d-49eb-9502-2f27466e5a6e	{"action":"token_refreshed","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:22:25.929424+00	
00000000-0000-0000-0000-000000000000	f106231d-b6aa-4e61-99c9-fdf61617754b	{"action":"token_refreshed","actor_id":"8e9c3797-9514-4bfe-ae20-b571ded65bcf","actor_username":"philip@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:22:26.407554+00	
00000000-0000-0000-0000-000000000000	bf1e89db-3392-43d8-a90e-f6a679d0bbff	{"action":"token_refreshed","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:22:26.409857+00	
00000000-0000-0000-0000-000000000000	0d3f7438-6fbc-4f56-ac78-312169afa14d	{"action":"token_refreshed","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-20 19:22:26.609717+00	
00000000-0000-0000-0000-000000000000	388de636-f8ee-40c6-96fe-81d6bac05f8a	{"action":"login","actor_id":"b60a1a5f-74dd-4b92-a223-2b80c1fd65e5","actor_username":"john@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-20 19:41:54.587559+00	
00000000-0000-0000-0000-000000000000	2a07cc21-51cd-4c61-93ed-db42255277aa	{"action":"token_refreshed","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 01:39:13.57015+00	
00000000-0000-0000-0000-000000000000	30d8956b-acdb-484e-9780-1aa1c6c48399	{"action":"token_revoked","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 01:39:13.575075+00	
00000000-0000-0000-0000-000000000000	2933abd1-7e4c-46b9-9f5c-c610af760c7b	{"action":"token_refreshed","actor_id":"8e9c3797-9514-4bfe-ae20-b571ded65bcf","actor_username":"philip@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 01:39:35.114471+00	
00000000-0000-0000-0000-000000000000	b3bd395d-b1d2-44b2-8475-a9b19e671f66	{"action":"token_revoked","actor_id":"8e9c3797-9514-4bfe-ae20-b571ded65bcf","actor_username":"philip@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 01:39:35.115014+00	
00000000-0000-0000-0000-000000000000	6d36e3e0-d1a4-4f0d-b192-8f5fdd1d5861	{"action":"token_refreshed","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 01:39:55.220126+00	
00000000-0000-0000-0000-000000000000	80014316-4c51-459b-b2c4-a10ccb89f2ff	{"action":"token_revoked","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 01:39:55.220774+00	
00000000-0000-0000-0000-000000000000	125d01ea-f4a3-4537-9897-d832c35499f7	{"action":"logout","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-07-21 02:29:46.423528+00	
00000000-0000-0000-0000-000000000000	410c1dd8-f3e2-40c4-81a9-5ab06f865cb9	{"action":"login","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-21 02:30:05.107131+00	
00000000-0000-0000-0000-000000000000	e7043e9a-92f5-4730-8acf-2c5056ee5afe	{"action":"token_refreshed","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 02:38:06.588497+00	
00000000-0000-0000-0000-000000000000	ae75381e-2373-4994-8d51-8fb23e1f917d	{"action":"token_revoked","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 02:38:06.589951+00	
00000000-0000-0000-0000-000000000000	af99f6e9-f125-4275-90aa-f401c8231943	{"action":"token_refreshed","actor_id":"8e9c3797-9514-4bfe-ae20-b571ded65bcf","actor_username":"philip@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 02:39:57.941748+00	
00000000-0000-0000-0000-000000000000	5ce052dd-9de6-491e-acbc-c28f4694acee	{"action":"token_revoked","actor_id":"8e9c3797-9514-4bfe-ae20-b571ded65bcf","actor_username":"philip@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 02:39:57.942581+00	
00000000-0000-0000-0000-000000000000	4b8e8b43-099f-4dbd-a038-8435ce69a244	{"action":"token_refreshed","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 03:32:59.517284+00	
00000000-0000-0000-0000-000000000000	47ff3a51-7d8a-476d-b3f6-9919f33915dd	{"action":"token_revoked","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 03:32:59.519693+00	
00000000-0000-0000-0000-000000000000	54be684b-8bbe-4708-887b-1fef0790a2dc	{"action":"token_refreshed","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 03:37:24.698608+00	
00000000-0000-0000-0000-000000000000	e3eed7ab-0f80-43f8-ae30-1fddf6389ad0	{"action":"token_revoked","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 03:37:24.70125+00	
00000000-0000-0000-0000-000000000000	4f04db10-ca9e-40d3-97dc-d7edf744d6d2	{"action":"token_refreshed","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 03:37:24.736001+00	
00000000-0000-0000-0000-000000000000	1b029aa7-e1a3-498d-8858-61a9e82e2c06	{"action":"token_refreshed","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 03:38:21.16684+00	
00000000-0000-0000-0000-000000000000	a57e45dc-a48e-4aca-bb30-9eaaf60aa8da	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-21 04:28:01.906161+00	
00000000-0000-0000-0000-000000000000	c5aca201-d818-4515-9829-b23316bbabd6	{"action":"token_refreshed","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 04:45:28.008838+00	
00000000-0000-0000-0000-000000000000	844c9d3a-77d1-4530-929e-832283edc102	{"action":"token_revoked","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 04:45:28.011503+00	
00000000-0000-0000-0000-000000000000	c07a4e9f-6ee3-4db1-8c51-c63e78fb0274	{"action":"token_refreshed","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 04:45:35.6796+00	
00000000-0000-0000-0000-000000000000	0af75ec7-7c21-4352-9edd-0df7d0f9ef7c	{"action":"token_revoked","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 04:45:35.680159+00	
00000000-0000-0000-0000-000000000000	d33bc3a2-60b3-4d1f-923f-484a17ff66a0	{"action":"logout","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-07-21 04:45:39.47986+00	
00000000-0000-0000-0000-000000000000	6de1e2c1-a8c2-44e2-8ee2-a3c89809be4f	{"action":"login","actor_id":"b60a1a5f-74dd-4b92-a223-2b80c1fd65e5","actor_username":"john@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-21 04:45:53.427251+00	
00000000-0000-0000-0000-000000000000	c9c05379-1f53-4bd1-ab9b-883d3d0dd9ff	{"action":"token_refreshed","actor_id":"b60a1a5f-74dd-4b92-a223-2b80c1fd65e5","actor_username":"john@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 05:44:18.174706+00	
00000000-0000-0000-0000-000000000000	f820f8ab-feeb-4f9d-ae5b-d2f7ccd15e95	{"action":"token_revoked","actor_id":"b60a1a5f-74dd-4b92-a223-2b80c1fd65e5","actor_username":"john@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 05:44:18.176163+00	
00000000-0000-0000-0000-000000000000	33b7e7e5-fcde-4067-96b1-350439616a5f	{"action":"token_refreshed","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 05:53:11.232909+00	
00000000-0000-0000-0000-000000000000	a0cabbba-7f22-4d52-8b44-e2c5722c5177	{"action":"token_revoked","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 05:53:11.235091+00	
00000000-0000-0000-0000-000000000000	34d8e120-1cbe-4b9d-9726-5e58f96f21ba	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-21 05:58:16.625155+00	
00000000-0000-0000-0000-000000000000	da98ab2d-caec-4ef5-ba45-9d4667d599a4	{"action":"token_refreshed","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 06:54:03.864439+00	
00000000-0000-0000-0000-000000000000	01661403-a8fc-4de3-8dbe-e9caa8126d4d	{"action":"token_revoked","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 06:54:03.870133+00	
00000000-0000-0000-0000-000000000000	c3c590e5-23d2-4958-9958-3c12069d51ed	{"action":"token_refreshed","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 06:56:53.227343+00	
00000000-0000-0000-0000-000000000000	a03eb726-1472-4fc7-8415-074dc8b50fde	{"action":"token_revoked","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 06:56:53.230552+00	
00000000-0000-0000-0000-000000000000	0ee984f3-1f4f-4941-9f45-be1ffbb7431d	{"action":"token_refreshed","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 06:56:54.046589+00	
00000000-0000-0000-0000-000000000000	5279d551-851e-4915-b8aa-65ed4717b0ca	{"action":"token_refreshed","actor_id":"b60a1a5f-74dd-4b92-a223-2b80c1fd65e5","actor_username":"john@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 06:58:25.505307+00	
00000000-0000-0000-0000-000000000000	ae6ba65f-8d41-42b1-83dc-11bb48e358d4	{"action":"token_revoked","actor_id":"b60a1a5f-74dd-4b92-a223-2b80c1fd65e5","actor_username":"john@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 06:58:25.50676+00	
00000000-0000-0000-0000-000000000000	fa62062b-477a-4d1f-ad9e-8e13850e2e3a	{"action":"token_refreshed","actor_id":"b60a1a5f-74dd-4b92-a223-2b80c1fd65e5","actor_username":"john@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 06:58:25.53385+00	
00000000-0000-0000-0000-000000000000	dcb0b874-2114-494c-8612-c7f70b57d683	{"action":"token_refreshed","actor_id":"b60a1a5f-74dd-4b92-a223-2b80c1fd65e5","actor_username":"john@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 07:32:15.741297+00	
00000000-0000-0000-0000-000000000000	55e9c8bb-1d7f-4f53-8d75-d08644c285ab	{"action":"user_confirmation_requested","actor_id":"55efbc20-ea6b-4c18-a9c6-261237f73594","actor_username":"widjayaphilip7@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-07-21 07:35:45.006071+00	
00000000-0000-0000-0000-000000000000	27608e12-fc97-4f9a-b3f0-10b9ec667679	{"action":"logout","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-07-21 07:36:22.775772+00	
00000000-0000-0000-0000-000000000000	3db71a28-2db1-4b42-8940-71a88d681686	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"widjayaphilip7@gmail.com","user_id":"55efbc20-ea6b-4c18-a9c6-261237f73594","user_phone":""}}	2025-07-21 07:45:57.501134+00	
00000000-0000-0000-0000-000000000000	342c4f65-f198-4a41-8447-db19bcd110ed	{"action":"user_signedup","actor_id":"30b3b4be-0cb9-447a-9d0b-fda557cea873","actor_username":"widjayaphilip7@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-07-21 07:46:33.936239+00	
00000000-0000-0000-0000-000000000000	ff1fd976-1d64-4a18-b9dd-16cf955f147c	{"action":"login","actor_id":"30b3b4be-0cb9-447a-9d0b-fda557cea873","actor_username":"widjayaphilip7@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-21 07:46:33.940151+00	
00000000-0000-0000-0000-000000000000	32231987-a7b5-4458-b239-a9d20d2c50ab	{"action":"user_repeated_signup","actor_id":"30b3b4be-0cb9-447a-9d0b-fda557cea873","actor_username":"widjayaphilip7@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-07-21 07:47:13.854519+00	
00000000-0000-0000-0000-000000000000	184801f9-ede9-4732-a822-b41ea5fe9b1e	{"action":"user_repeated_signup","actor_id":"30b3b4be-0cb9-447a-9d0b-fda557cea873","actor_username":"widjayaphilip7@gmail.com","actor_via_sso":false,"log_type":"user","traits":{"provider":"email"}}	2025-07-21 07:48:08.117895+00	
00000000-0000-0000-0000-000000000000	4e136085-88f6-4a90-936f-5c8154563fcd	{"action":"user_signedup","actor_id":"f0abb165-c11c-4147-92b8-b1de389dfdf9","actor_username":"flufyrusselwidjaya@gmail.com","actor_via_sso":false,"log_type":"team","traits":{"provider":"email"}}	2025-07-21 07:48:51.398158+00	
00000000-0000-0000-0000-000000000000	0dd0b4f3-a0d7-48fb-8a6f-f5d25b43f3e6	{"action":"login","actor_id":"f0abb165-c11c-4147-92b8-b1de389dfdf9","actor_username":"flufyrusselwidjaya@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-21 07:48:51.402224+00	
00000000-0000-0000-0000-000000000000	0b1d4bf9-9571-43c3-b7b5-1184f650f815	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"widjayaphilip7@gmail.com","user_id":"30b3b4be-0cb9-447a-9d0b-fda557cea873","user_phone":""}}	2025-07-21 07:52:31.4851+00	
00000000-0000-0000-0000-000000000000	72e163f4-aabf-46e8-86ab-d145a8dfabe4	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"flufyrusselwidjaya@gmail.com","user_id":"f0abb165-c11c-4147-92b8-b1de389dfdf9","user_phone":""}}	2025-07-21 07:52:32.925549+00	
00000000-0000-0000-0000-000000000000	8516a1ef-ce9c-4f74-baa3-4504750ac65b	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"widjayaphilip7@gmail.com","user_id":"4360c7d0-2fb6-456b-b956-4c5429b107b4","user_phone":""}}	2025-07-21 07:52:53.203268+00	
00000000-0000-0000-0000-000000000000	05ed4390-339e-4794-8cbf-639c30e6b893	{"action":"user_deleted","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"user_email":"widjayaphilip7@gmail.com","user_id":"4360c7d0-2fb6-456b-b956-4c5429b107b4","user_phone":""}}	2025-07-21 07:52:53.335274+00	
00000000-0000-0000-0000-000000000000	f568e8f7-7409-41dc-8b7c-a0e18274c2ee	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-21 07:54:28.545382+00	
00000000-0000-0000-0000-000000000000	f304d2a2-f772-4687-a45d-df6a1229a03e	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"johnsnow@gmail.com","user_id":"eb353ab1-ebc2-4ba2-a2c8-e73ad64a1c80","user_phone":""}}	2025-07-21 07:55:24.862421+00	
00000000-0000-0000-0000-000000000000	b70700dd-560e-461a-bda7-0df4cb853079	{"action":"user_signedup","actor_id":"00000000-0000-0000-0000-000000000000","actor_username":"service_role","actor_via_sso":false,"log_type":"team","traits":{"provider":"email","user_email":"reed@gmail.com","user_id":"8497103b-79bf-451f-b8fe-ae2a2cb8531f","user_phone":""}}	2025-07-21 07:57:14.980864+00	
00000000-0000-0000-0000-000000000000	0a7df6ec-0cd0-4492-9ba2-7e7c51fe1fc0	{"action":"login","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-21 08:09:15.019056+00	
00000000-0000-0000-0000-000000000000	782c31c0-5cfb-449e-97ba-e9bab066563f	{"action":"logout","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-07-21 08:16:00.686921+00	
00000000-0000-0000-0000-000000000000	9b082e8c-b780-434a-a06b-45991e7b35d5	{"action":"login","actor_id":"5549541e-5727-425c-9e78-d3811a8cfe41","actor_username":"jane@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-21 08:16:10.144869+00	
00000000-0000-0000-0000-000000000000	5f5f0fe8-54e4-4397-b579-611c1f894887	{"action":"token_refreshed","actor_id":"b60a1a5f-74dd-4b92-a223-2b80c1fd65e5","actor_username":"john@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 08:36:01.606291+00	
00000000-0000-0000-0000-000000000000	639c4f36-6b96-43c2-9182-80b88c8b5573	{"action":"token_revoked","actor_id":"b60a1a5f-74dd-4b92-a223-2b80c1fd65e5","actor_username":"john@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 08:36:01.607731+00	
00000000-0000-0000-0000-000000000000	6fae7b3e-3675-4fcd-8f56-47fc3e05219f	{"action":"token_refreshed","actor_id":"5549541e-5727-425c-9e78-d3811a8cfe41","actor_username":"jane@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 09:14:23.89161+00	
00000000-0000-0000-0000-000000000000	a483ce36-f807-4add-a0f5-af1f75cb4b32	{"action":"token_revoked","actor_id":"5549541e-5727-425c-9e78-d3811a8cfe41","actor_username":"jane@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 09:14:23.893757+00	
00000000-0000-0000-0000-000000000000	d3d9d988-2166-4151-b180-cfb08074be7e	{"action":"token_refreshed","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 09:15:57.143368+00	
00000000-0000-0000-0000-000000000000	09fb9169-2835-4d04-8b20-d5abd465b0dd	{"action":"token_revoked","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 09:15:57.144176+00	
00000000-0000-0000-0000-000000000000	42834f6a-b9a9-4ddc-9da7-2eb96fd0ac8c	{"action":"logout","actor_id":"5549541e-5727-425c-9e78-d3811a8cfe41","actor_username":"jane@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-07-21 09:33:30.964108+00	
00000000-0000-0000-0000-000000000000	3b36ef66-dfc9-4c99-a7a8-17c7bae7fa2a	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-21 09:40:46.407908+00	
00000000-0000-0000-0000-000000000000	f305680a-7399-4599-893f-981e5b6d9e59	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-21 09:47:18.916557+00	
00000000-0000-0000-0000-000000000000	88876b90-49a6-4c37-a7f9-e5e68dcdba20	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-21 09:53:26.026214+00	
00000000-0000-0000-0000-000000000000	c8c8e024-956c-4836-a811-81161ea42c59	{"action":"token_refreshed","actor_id":"b60a1a5f-74dd-4b92-a223-2b80c1fd65e5","actor_username":"john@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 09:57:57.588822+00	
00000000-0000-0000-0000-000000000000	4dbdfa6f-9d02-476e-881a-0c82dbfc6225	{"action":"token_revoked","actor_id":"b60a1a5f-74dd-4b92-a223-2b80c1fd65e5","actor_username":"john@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 09:57:57.591171+00	
00000000-0000-0000-0000-000000000000	e65fdde6-55b0-4b49-ab71-369687e1044f	{"action":"token_refreshed","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 10:43:33.434482+00	
00000000-0000-0000-0000-000000000000	2242b263-b6e7-4aad-8423-58e58f242149	{"action":"token_revoked","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 10:43:33.43645+00	
00000000-0000-0000-0000-000000000000	b995d53f-d6b8-4bae-b6bc-f91e80d0ac48	{"action":"token_refreshed","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 10:58:45.11995+00	
00000000-0000-0000-0000-000000000000	5e58afc1-1852-4cfa-99d2-f943828aed64	{"action":"token_revoked","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 10:58:45.122442+00	
00000000-0000-0000-0000-000000000000	f64ea8cb-f902-45cc-b86b-67a932bd3088	{"action":"token_refreshed","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 10:58:45.236404+00	
00000000-0000-0000-0000-000000000000	1ec209bf-d841-40e9-8f22-272f914c0c55	{"action":"token_refreshed","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 10:58:45.375815+00	
00000000-0000-0000-0000-000000000000	87dec248-3446-4b80-86e1-533ed77b2cf6	{"action":"token_refreshed","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 10:58:45.689703+00	
00000000-0000-0000-0000-000000000000	4201dc68-10db-4a07-9c2d-8fea54fb3cbb	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-21 11:08:44.149102+00	
00000000-0000-0000-0000-000000000000	dc5a0a66-f694-4f22-a1d5-c1e398eaf3d4	{"action":"token_refreshed","actor_id":"b60a1a5f-74dd-4b92-a223-2b80c1fd65e5","actor_username":"john@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 11:10:21.254975+00	
00000000-0000-0000-0000-000000000000	ee4e0e63-d862-47d0-847e-66e521809e63	{"action":"token_revoked","actor_id":"b60a1a5f-74dd-4b92-a223-2b80c1fd65e5","actor_username":"john@gmail.com","actor_via_sso":false,"log_type":"token"}	2025-07-21 11:10:21.255733+00	
00000000-0000-0000-0000-000000000000	010a90a6-4835-46b8-bfca-3712b5dba760	{"action":"logout","actor_id":"b60a1a5f-74dd-4b92-a223-2b80c1fd65e5","actor_username":"john@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-07-21 11:22:23.97444+00	
00000000-0000-0000-0000-000000000000	a9761dff-be3a-4a55-9208-37117d6d5e24	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-21 11:22:30.55566+00	
00000000-0000-0000-0000-000000000000	52952f89-4abf-4898-9780-a71191c838c7	{"action":"logout","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-07-21 11:25:53.61366+00	
00000000-0000-0000-0000-000000000000	d3c01fcb-8a28-422d-99f1-f8a4945aac28	{"action":"login","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-21 11:26:02.237167+00	
00000000-0000-0000-0000-000000000000	d93efedd-548c-4157-97d8-24ef9eaac08e	{"action":"logout","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-07-21 11:29:10.758549+00	
00000000-0000-0000-0000-000000000000	0dadf4c1-858e-41fb-882b-5f4bb5e393e7	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-21 11:29:16.356091+00	
00000000-0000-0000-0000-000000000000	5df7261b-b351-49bb-84ee-1fcdea56f001	{"action":"logout","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-07-21 11:31:14.592259+00	
00000000-0000-0000-0000-000000000000	f3201ed8-4c64-4be0-9682-4e966e67befd	{"action":"login","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-21 11:31:59.009316+00	
00000000-0000-0000-0000-000000000000	ec06cc20-c081-49e4-8d28-3070377698df	{"action":"logout","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-07-21 11:35:04.94285+00	
00000000-0000-0000-0000-000000000000	7a0d458e-897f-4fa7-a9fb-31ecd154555b	{"action":"login","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-21 11:35:10.613512+00	
00000000-0000-0000-0000-000000000000	25c2b7b1-e7ba-4379-bf37-d38d43cc45f4	{"action":"logout","actor_id":"06e4e06c-daa3-44e6-887e-a3a1a3c616c4","actor_username":"admin@gmail.com","actor_via_sso":false,"log_type":"account"}	2025-07-21 11:35:28.910417+00	
00000000-0000-0000-0000-000000000000	fd36a1e0-2114-469f-81da-32db113f8582	{"action":"login","actor_id":"98fb6405-1944-428d-9f65-0d93dcaa3486","actor_username":"mary@gmail.com","actor_via_sso":false,"log_type":"account","traits":{"provider":"email"}}	2025-07-21 11:35:35.948143+00	
\.


--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."flow_state" ("id", "user_id", "auth_code", "code_challenge_method", "code_challenge", "provider_type", "provider_access_token", "provider_refresh_token", "created_at", "updated_at", "authentication_method", "auth_code_issued_at") FROM stdin;
58021b2b-39a9-4d00-8033-e5cf6e26c740	55efbc20-ea6b-4c18-a9c6-261237f73594	3e57b6fb-9750-44e3-9008-a991002a2a22	s256	MCmXV-2U9sJu_YeLA04aivMe2rST8Ih4DyL9INAuKoU	email			2025-07-21 07:35:45.007456+00	2025-07-21 07:35:45.007456+00	email/signup	\N
\.


--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."identities" ("provider_id", "user_id", "identity_data", "provider", "last_sign_in_at", "created_at", "updated_at", "id") FROM stdin;
06e4e06c-daa3-44e6-887e-a3a1a3c616c4	06e4e06c-daa3-44e6-887e-a3a1a3c616c4	{"sub": "06e4e06c-daa3-44e6-887e-a3a1a3c616c4", "email": "admin@gmail.com", "email_verified": false, "phone_verified": false}	email	2025-07-19 13:40:22.319669+00	2025-07-19 13:40:22.319728+00	2025-07-19 13:40:22.319728+00	60ed501a-2d7e-4f6b-bc26-400a86081829
5549541e-5727-425c-9e78-d3811a8cfe41	5549541e-5727-425c-9e78-d3811a8cfe41	{"sub": "5549541e-5727-425c-9e78-d3811a8cfe41", "email": "jane@gmail.com", "email_verified": false, "phone_verified": false}	email	2025-07-20 15:05:08.902319+00	2025-07-20 15:05:08.902374+00	2025-07-20 15:05:08.902374+00	bbbd9099-674c-4550-aae7-576c1ee7b10c
b60a1a5f-74dd-4b92-a223-2b80c1fd65e5	b60a1a5f-74dd-4b92-a223-2b80c1fd65e5	{"sub": "b60a1a5f-74dd-4b92-a223-2b80c1fd65e5", "email": "john@gmail.com", "email_verified": false, "phone_verified": false}	email	2025-07-20 15:05:21.538495+00	2025-07-20 15:05:21.538542+00	2025-07-20 15:05:21.538542+00	4f03d535-85e5-43ec-8574-4e03dfd3cb9e
8e9c3797-9514-4bfe-ae20-b571ded65bcf	8e9c3797-9514-4bfe-ae20-b571ded65bcf	{"sub": "8e9c3797-9514-4bfe-ae20-b571ded65bcf", "email": "philip@gmail.com", "email_verified": false, "phone_verified": false}	email	2025-07-20 15:05:36.513549+00	2025-07-20 15:05:36.513606+00	2025-07-20 15:05:36.513606+00	fa039f5f-6107-4b0e-a8a9-d7ddd4997f77
98fb6405-1944-428d-9f65-0d93dcaa3486	98fb6405-1944-428d-9f65-0d93dcaa3486	{"sub": "98fb6405-1944-428d-9f65-0d93dcaa3486", "email": "mary@gmail.com", "email_verified": false, "phone_verified": false}	email	2025-07-20 15:06:15.387786+00	2025-07-20 15:06:15.387832+00	2025-07-20 15:06:15.387832+00	989b03a2-5ca3-4319-bbf3-3da91b504cce
eb353ab1-ebc2-4ba2-a2c8-e73ad64a1c80	eb353ab1-ebc2-4ba2-a2c8-e73ad64a1c80	{"sub": "eb353ab1-ebc2-4ba2-a2c8-e73ad64a1c80", "email": "johnsnow@gmail.com", "email_verified": false, "phone_verified": false}	email	2025-07-21 07:55:24.861696+00	2025-07-21 07:55:24.861748+00	2025-07-21 07:55:24.861748+00	66e3f5d9-e1d2-448a-a60e-06153a50194c
8497103b-79bf-451f-b8fe-ae2a2cb8531f	8497103b-79bf-451f-b8fe-ae2a2cb8531f	{"sub": "8497103b-79bf-451f-b8fe-ae2a2cb8531f", "email": "reed@gmail.com", "email_verified": false, "phone_verified": false}	email	2025-07-21 07:57:14.979917+00	2025-07-21 07:57:14.979969+00	2025-07-21 07:57:14.979969+00	faa595db-1112-48ee-8119-54b76d436fb9
\.


--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."instances" ("id", "uuid", "raw_base_config", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."mfa_amr_claims" ("session_id", "created_at", "updated_at", "authentication_method", "id") FROM stdin;
ecb93d20-8407-49ef-b049-2d160c211212	2025-07-20 18:17:40.928565+00	2025-07-20 18:17:40.928565+00	password	8957a78e-cce4-401c-aaa4-f7e272c303ca
c72f85ba-af3e-4279-908b-1651811f2267	2025-07-21 11:35:35.950799+00	2025-07-21 11:35:35.950799+00	password	ee7a919b-e7d5-422d-86ea-b6e5e1eec791
\.


--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."mfa_challenges" ("id", "factor_id", "created_at", "verified_at", "ip_address", "otp_code", "web_authn_session_data") FROM stdin;
\.


--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."mfa_factors" ("id", "user_id", "friendly_name", "factor_type", "status", "created_at", "updated_at", "secret", "phone", "last_challenged_at", "web_authn_credential", "web_authn_aaguid") FROM stdin;
\.


--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."one_time_tokens" ("id", "user_id", "token_type", "token_hash", "relates_to", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."refresh_tokens" ("instance_id", "id", "token", "user_id", "revoked", "created_at", "updated_at", "parent", "session_id") FROM stdin;
00000000-0000-0000-0000-000000000000	83	ony2xy3hfrtq	98fb6405-1944-428d-9f65-0d93dcaa3486	f	2025-07-21 11:35:35.949657+00	2025-07-21 11:35:35.949657+00	\N	c72f85ba-af3e-4279-908b-1651811f2267
00000000-0000-0000-0000-000000000000	37	64w2pcpbxmkw	8e9c3797-9514-4bfe-ae20-b571ded65bcf	t	2025-07-20 18:17:40.927361+00	2025-07-20 19:19:41.717845+00	\N	ecb93d20-8407-49ef-b049-2d160c211212
00000000-0000-0000-0000-000000000000	40	bwavvzfee6j3	8e9c3797-9514-4bfe-ae20-b571ded65bcf	t	2025-07-20 19:19:41.720051+00	2025-07-21 01:39:35.115467+00	64w2pcpbxmkw	ecb93d20-8407-49ef-b049-2d160c211212
00000000-0000-0000-0000-000000000000	45	zehlsnck6tn7	8e9c3797-9514-4bfe-ae20-b571ded65bcf	t	2025-07-21 01:39:35.115776+00	2025-07-21 02:39:57.943125+00	bwavvzfee6j3	ecb93d20-8407-49ef-b049-2d160c211212
00000000-0000-0000-0000-000000000000	49	cyj3uggulvei	8e9c3797-9514-4bfe-ae20-b571ded65bcf	f	2025-07-21 02:39:57.943783+00	2025-07-21 02:39:57.943783+00	zehlsnck6tn7	ecb93d20-8407-49ef-b049-2d160c211212
\.


--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."saml_providers" ("id", "sso_provider_id", "entity_id", "metadata_xml", "metadata_url", "attribute_mapping", "created_at", "updated_at", "name_id_format") FROM stdin;
\.


--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."saml_relay_states" ("id", "sso_provider_id", "request_id", "for_email", "redirect_to", "created_at", "updated_at", "flow_state_id") FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."schema_migrations" ("version") FROM stdin;
20171026211738
20171026211808
20171026211834
20180103212743
20180108183307
20180119214651
20180125194653
00
20210710035447
20210722035447
20210730183235
20210909172000
20210927181326
20211122151130
20211124214934
20211202183645
20220114185221
20220114185340
20220224000811
20220323170000
20220429102000
20220531120530
20220614074223
20220811173540
20221003041349
20221003041400
20221011041400
20221020193600
20221021073300
20221021082433
20221027105023
20221114143122
20221114143410
20221125140132
20221208132122
20221215195500
20221215195800
20221215195900
20230116124310
20230116124412
20230131181311
20230322519590
20230402418590
20230411005111
20230508135423
20230523124323
20230818113222
20230914180801
20231027141322
20231114161723
20231117164230
20240115144230
20240214120130
20240306115329
20240314092811
20240427152123
20240612123726
20240729123726
20240802193726
20240806073726
20241009103726
\.


--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."sessions" ("id", "user_id", "created_at", "updated_at", "factor_id", "aal", "not_after", "refreshed_at", "user_agent", "ip", "tag") FROM stdin;
ecb93d20-8407-49ef-b049-2d160c211212	8e9c3797-9514-4bfe-ae20-b571ded65bcf	2025-07-20 18:17:40.926643+00	2025-07-21 02:39:57.950712+00	\N	aal1	\N	2025-07-21 02:39:57.950639	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36	175.38.231.63	\N
c72f85ba-af3e-4279-908b-1651811f2267	98fb6405-1944-428d-9f65-0d93dcaa3486	2025-07-21 11:35:35.948897+00	2025-07-21 11:35:35.948897+00	\N	aal1	\N	\N	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36	175.38.231.63	\N
\.


--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."sso_domains" ("id", "sso_provider_id", "domain", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."sso_providers" ("id", "resource_id", "created_at", "updated_at") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: -
--

COPY "auth"."users" ("instance_id", "id", "aud", "role", "email", "encrypted_password", "email_confirmed_at", "invited_at", "confirmation_token", "confirmation_sent_at", "recovery_token", "recovery_sent_at", "email_change_token_new", "email_change", "email_change_sent_at", "last_sign_in_at", "raw_app_meta_data", "raw_user_meta_data", "is_super_admin", "created_at", "updated_at", "phone", "phone_confirmed_at", "phone_change", "phone_change_token", "phone_change_sent_at", "email_change_token_current", "email_change_confirm_status", "banned_until", "reauthentication_token", "reauthentication_sent_at", "is_sso_user", "deleted_at", "is_anonymous") FROM stdin;
00000000-0000-0000-0000-000000000000	eb353ab1-ebc2-4ba2-a2c8-e73ad64a1c80	authenticated	authenticated	johnsnow@gmail.com	$2a$10$oXFAaaWxPvzsKxd6zQ/wOOP7JpWoBdfJX35.iVv3St0aqbZNKI27u	2025-07-21 07:55:24.86337+00	\N		\N		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"role": "tutor", "last_name": "snow", "first_name": "John", "email_verified": true}	\N	2025-07-21 07:55:24.860673+00	2025-07-21 07:55:24.864026+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	8e9c3797-9514-4bfe-ae20-b571ded65bcf	authenticated	authenticated	philip@gmail.com	$2a$10$WhCRedA7Ciaa0OHInBDxxOlobxQuFeEBikNmrZgh6H.77UvOrM0rK	2025-07-20 15:05:36.515384+00	\N		\N		\N			\N	2025-07-20 18:17:40.926561+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-07-20 15:05:36.512453+00	2025-07-21 02:39:57.94482+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	b60a1a5f-74dd-4b92-a223-2b80c1fd65e5	authenticated	authenticated	john@gmail.com	$2a$10$X73/YLmwvUvqXBw4XwgxvuVNhN9QZLAGtKDrnLGmSsEkBrs.4WKQW	2025-07-20 15:05:21.540199+00	\N		\N		\N			\N	2025-07-21 04:45:53.427994+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-07-20 15:05:21.537432+00	2025-07-21 11:10:21.257779+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	8497103b-79bf-451f-b8fe-ae2a2cb8531f	authenticated	authenticated	reed@gmail.com	$2a$10$WyTIZzm6AwJzUV5PFD9fBeftKS3qp05P1g/WZ8gTM9mxrrIR2JfQ6	2025-07-21 07:57:14.983881+00	\N		\N		\N			\N	\N	{"provider": "email", "providers": ["email"]}	{"role": "student", "last_name": "richards", "first_name": "reed", "email_verified": true}	\N	2025-07-21 07:57:14.977907+00	2025-07-21 07:57:14.984686+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	06e4e06c-daa3-44e6-887e-a3a1a3c616c4	authenticated	authenticated	admin@gmail.com	$2a$10$bsjHq3mdJtYcaQmitpEor.gfJSDUXgpCOggKoBaHksFkgPSMVsAJO	2025-07-19 13:40:22.326337+00	\N		\N		\N			\N	2025-07-21 11:35:10.614192+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-07-19 13:40:22.311486+00	2025-07-21 11:35:10.615798+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	5549541e-5727-425c-9e78-d3811a8cfe41	authenticated	authenticated	jane@gmail.com	$2a$10$eI4J4PWeJZwa1Vw/to6BYOlMeQIM7aB7BuRPMp2cdR0.lLBGIHK8G	2025-07-20 15:05:08.908227+00	\N		\N		\N			\N	2025-07-21 08:16:10.145517+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-07-20 15:05:08.894031+00	2025-07-21 09:14:23.898437+00	\N	\N			\N		0	\N		\N	f	\N	f
00000000-0000-0000-0000-000000000000	98fb6405-1944-428d-9f65-0d93dcaa3486	authenticated	authenticated	mary@gmail.com	$2a$10$0.7ITf5chIBfqf5Ed9RycuUGHUQpIsZ.1fQn.4npk01ZBqZ/SFcIS	2025-07-20 15:06:15.389454+00	\N		\N		\N			\N	2025-07-21 11:35:35.948822+00	{"provider": "email", "providers": ["email"]}	{"email_verified": true}	\N	2025-07-20 15:06:15.386868+00	2025-07-21 11:35:35.950501+00	\N	\N			\N		0	\N		\N	f	\N	f
\.


--
-- Data for Name: campuses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."campuses" ("id", "name", "address", "google_maps_link", "status", "created_at") FROM stdin;
3daf5af6-087a-4ebd-a3cb-22ce32ceae9b	Glen Waverley	222-224 Coleman Parade, Glen Waverley VIC 3150	https://goo.gl/maps/example1	active	2025-07-19 12:03:55.852107+00
5421277a-a589-418b-95ee-e3825dd5d25f	Melbourne CBD	Level 5/341 Queen St, Melbourne VIC 3000	https://goo.gl/maps/example2	active	2025-07-19 12:03:55.852107+00
04f659c3-8ef7-4595-aef3-10caf676e724	Narre Warren	60-62 Webb St, Narre Warren VIC 3805	https://goo.gl/maps/example4	active	2025-07-19 12:03:55.852107+00
3cc50671-f56e-4cce-8417-eed778431a8a	Point Cook	1/22-30 Wallace Ave, Point Cook VIC 3030	https://goo.gl/maps/example5	active	2025-07-19 12:03:55.852107+00
\.


--
-- Data for Name: enrolments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."enrolments" ("student_id", "subject_id", "enrol_date", "status") FROM stdin;
b60a1a5f-74dd-4b92-a223-2b80c1fd65e5	1a0c870a-98b7-47fb-9202-9100a4af8bf4	2025-07-21	active
b60a1a5f-74dd-4b92-a223-2b80c1fd65e5	e06cff16-eaa7-444d-a4f2-a10ad499e6cc	2025-07-21	active
8e9c3797-9514-4bfe-ae20-b571ded65bcf	edcf5553-b5c6-40d0-bfa3-48ea4dc262b3	2025-07-21	active
\.


--
-- Data for Name: lesson_students; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."lesson_students" ("lesson_id", "student_id") FROM stdin;
901336a6-85da-452b-a1a3-e8f79fb11236	8e9c3797-9514-4bfe-ae20-b571ded65bcf
60d01a07-22ca-455f-81db-3d46284392a6	b60a1a5f-74dd-4b92-a223-2b80c1fd65e5
7810d3ab-985e-4c27-9070-cfc540cdca72	b60a1a5f-74dd-4b92-a223-2b80c1fd65e5
7810d3ab-985e-4c27-9070-cfc540cdca72	8e9c3797-9514-4bfe-ae20-b571ded65bcf
\.


--
-- Data for Name: lesson_tutors; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."lesson_tutors" ("lesson_id", "tutor_id") FROM stdin;
901336a6-85da-452b-a1a3-e8f79fb11236	98fb6405-1944-428d-9f65-0d93dcaa3486
60d01a07-22ca-455f-81db-3d46284392a6	5549541e-5727-425c-9e78-d3811a8cfe41
7810d3ab-985e-4c27-9070-cfc540cdca72	5549541e-5727-425c-9e78-d3811a8cfe41
7810d3ab-985e-4c27-9070-cfc540cdca72	eb353ab1-ebc2-4ba2-a2c8-e73ad64a1c80
\.


--
-- Data for Name: lessons; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."lessons" ("id", "subject_id", "title", "start_time", "end_time", "location", "status", "created_by", "created_at", "updated_at", "campus_id", "room_id", "location_detail") FROM stdin;
901336a6-85da-452b-a1a3-e8f79fb11236	edcf5553-b5c6-40d0-bfa3-48ea4dc262b3	VCE Methods 3&4 - Weekly Session	2025-07-23 15:10:50.905758+00	2025-07-23 17:10:50.905758+00	\N	scheduled	98fb6405-1944-428d-9f65-0d93dcaa3486	2025-07-20 15:10:50.905758+00	2025-07-20 15:10:50.905758+00	3daf5af6-087a-4ebd-a3cb-22ce32ceae9b	fdab6e20-a818-411e-b5af-a9d04a3e5bc6	\N
60d01a07-22ca-455f-81db-3d46284392a6	e06cff16-eaa7-444d-a4f2-a10ad499e6cc	intro to english	2025-07-25 09:58:00+00	2025-07-25 10:58:00+00		scheduled	06e4e06c-daa3-44e6-887e-a3a1a3c616c4	2025-07-21 05:59:17.414082+00	2025-07-21 05:59:17.414082+00	\N	\N	zoom.link.com
7810d3ab-985e-4c27-9070-cfc540cdca72	e06cff16-eaa7-444d-a4f2-a10ad499e6cc	VCE English 1&2 - Online Workshop	2025-07-23 19:10:00+00	2025-07-23 21:10:00+00		scheduled	5549541e-5727-425c-9e78-d3811a8cfe41	2025-07-20 15:10:50.905758+00	2025-07-21 08:15:50.627+00	\N	\N	https://zoom.us/j/1234567890?pwd=EXAMPLE
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."profiles" ("id", "first_name", "last_name", "role", "contact_email", "phone_number", "avatar_url", "school_name", "vce_year_level", "parent_guardian_name", "parent_guardian_email", "parent_guardian_phone", "job_title", "bio", "qualifications", "emergency_contact_name", "emergency_contact_phone", "created_at") FROM stdin;
06e4e06c-daa3-44e6-887e-a3a1a3c616c4	philip	Widjaja	admin	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	\N	2025-07-20 18:16:14.680416+00
98fb6405-1944-428d-9f65-0d93dcaa3486	Mary	Anne	tutor	\N	\N	\N	\N	\N	\N	\N	\N	Lead Methods Tutor	Specializing in VCE Mathematical Methods with 5+ years of experience.	{"atar": 99.85, "major": "Mathematics", "degree": "B.Sci"}	\N	\N	2025-07-20 18:16:14.680416+00
5549541e-5727-425c-9e78-d3811a8cfe41	Jane	Doe	tutor	\N	\N	\N	\N	\N	\N	\N	\N	Senior English Tutor	Passionate about literature and helping students excel in VCE English.	{"major": "Literature", "degree": "B.Arts", "wwcc_status": "valid"}	\N	\N	2025-07-20 18:16:14.680416+00
eb353ab1-ebc2-4ba2-a2c8-e73ad64a1c80	John	snow	tutor	johnsnow@gmail.com	\N	\N	\N	\N	\N	\N	\N	Senior English Tutor	eng	\N	\N	\N	2025-07-21 07:55:24.94098+00
b60a1a5f-74dd-4b92-a223-2b80c1fd65e5	John	wick	student	john@gmail.com	\N	\N	Box Hill High School	11	David Smith	d.smith@email.com	0487654321	\N	\N	\N	\N	\N	2025-07-20 18:16:14.680416+00
8e9c3797-9514-4bfe-ae20-b571ded65bcf	Philip	Jones	student	philip@gmail.com	\N	\N	Glen Waverley Secondary College	12	Sarah Jones	sarah.j@email.com	0412345678	\N	\N	\N	\N	\N	2025-07-20 18:16:14.680416+00
\.


--
-- Data for Name: rooms; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."rooms" ("id", "campus_id", "name", "capacity", "status", "created_at") FROM stdin;
fdab6e20-a818-411e-b5af-a9d04a3e5bc6	3daf5af6-087a-4ebd-a3cb-22ce32ceae9b	Room 1	15	active	2025-07-19 12:03:55.852107+00
d18916d0-6517-4876-a0cc-80d1f102ce6f	3daf5af6-087a-4ebd-a3cb-22ce32ceae9b	Room 2	20	active	2025-07-19 12:03:55.852107+00
dc2a0351-1c21-49e2-acee-5448a7b416f7	3daf5af6-087a-4ebd-a3cb-22ce32ceae9b	Room 3	15	active	2025-07-19 12:03:55.852107+00
40b52e12-e42b-48c7-8915-d0d207e26a6f	3daf5af6-087a-4ebd-a3cb-22ce32ceae9b	Seminar Room	30	active	2025-07-19 12:03:55.852107+00
0a2f4a91-f51d-42bd-9636-bfa5ec72d54e	5421277a-a589-418b-95ee-e3825dd5d25f	Suite 5.1	12	active	2025-07-19 12:03:55.852107+00
f5a5b2a8-8f37-4d31-b41a-910f59ace275	5421277a-a589-418b-95ee-e3825dd5d25f	Suite 5.2	12	active	2025-07-19 12:03:55.852107+00
50ba858e-aecb-40f0-b621-c039e5261165	5421277a-a589-418b-95ee-e3825dd5d25f	Boardroom	25	active	2025-07-19 12:03:55.852107+00
ac8cc110-f89b-4148-9c6d-c0cacdc0ba36	04f659c3-8ef7-4595-aef3-10caf676e724	Classroom 1	20	active	2025-07-19 12:03:55.852107+00
3ba1d559-dc27-49e1-b782-2c608a04713a	04f659c3-8ef7-4595-aef3-10caf676e724	Classroom 2	20	active	2025-07-19 12:03:55.852107+00
a303600d-d590-4409-8db0-9ef915e8cac5	04f659c3-8ef7-4595-aef3-10caf676e724	Lab	25	active	2025-07-19 12:03:55.852107+00
8e12543a-780d-43eb-bc95-684ef919370f	3cc50671-f56e-4cce-8417-eed778431a8a	Learning Hub 1	16	active	2025-07-19 12:03:55.852107+00
213dbc59-d6cd-40b8-a9bd-8f09eccc6a54	3cc50671-f56e-4cce-8417-eed778431a8a	Learning Hub 2	16	active	2025-07-19 12:03:55.852107+00
23980996-23f8-48e3-b0d6-5a6c4fdad8a9	3cc50671-f56e-4cce-8417-eed778431a8a	Focus Room	8	active	2025-07-19 12:03:55.852107+00
\.


--
-- Data for Name: subjects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."subjects" ("id", "code", "title", "created_at") FROM stdin;
edcf5553-b5c6-40d0-bfa3-48ea4dc262b3	VCE-MM-34	VCE Mathematical Methods Units 3&4	2025-07-20 15:10:50.905758+00
e06cff16-eaa7-444d-a4f2-a10ad499e6cc	VCE-EN-12	VCE English Units 1&2	2025-07-20 15:10:50.905758+00
1a0c870a-98b7-47fb-9202-9100a4af8bf4	VCE-CH-34	VCE Chemistry Units 3&4	2025-07-20 15:10:50.905758+00
\.


--
-- Data for Name: tutor_subjects; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."tutor_subjects" ("tutor_id", "subject_id", "is_lead_tutor", "assigned_at") FROM stdin;
5549541e-5727-425c-9e78-d3811a8cfe41	e06cff16-eaa7-444d-a4f2-a10ad499e6cc	f	2025-07-20 16:16:20.33775+00
98fb6405-1944-428d-9f65-0d93dcaa3486	edcf5553-b5c6-40d0-bfa3-48ea4dc262b3	f	2025-07-20 16:17:00.192773+00
98fb6405-1944-428d-9f65-0d93dcaa3486	1a0c870a-98b7-47fb-9202-9100a4af8bf4	f	2025-07-20 17:02:15.049128+00
eb353ab1-ebc2-4ba2-a2c8-e73ad64a1c80	e06cff16-eaa7-444d-a4f2-a10ad499e6cc	f	2025-07-21 07:55:25.152229+00
5549541e-5727-425c-9e78-d3811a8cfe41	1a0c870a-98b7-47fb-9202-9100a4af8bf4	f	2025-07-21 09:28:09.071115+00
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY "realtime"."schema_migrations" ("version", "inserted_at") FROM stdin;
20211116024918	2025-07-19 06:16:09
20211116045059	2025-07-19 06:16:10
20211116050929	2025-07-19 06:16:11
20211116051442	2025-07-19 06:16:12
20211116212300	2025-07-19 06:16:13
20211116213355	2025-07-19 06:16:14
20211116213934	2025-07-19 06:16:15
20211116214523	2025-07-19 06:16:16
20211122062447	2025-07-19 06:16:17
20211124070109	2025-07-19 06:16:18
20211202204204	2025-07-19 06:16:19
20211202204605	2025-07-19 06:16:20
20211210212804	2025-07-19 06:16:23
20211228014915	2025-07-19 06:16:24
20220107221237	2025-07-19 06:16:25
20220228202821	2025-07-19 06:16:25
20220312004840	2025-07-19 06:16:26
20220603231003	2025-07-19 06:16:28
20220603232444	2025-07-19 06:16:29
20220615214548	2025-07-19 06:16:30
20220712093339	2025-07-19 06:16:31
20220908172859	2025-07-19 06:16:32
20220916233421	2025-07-19 06:16:33
20230119133233	2025-07-19 06:16:34
20230128025114	2025-07-19 06:16:35
20230128025212	2025-07-19 06:16:36
20230227211149	2025-07-19 06:16:37
20230228184745	2025-07-19 06:16:38
20230308225145	2025-07-19 06:16:39
20230328144023	2025-07-19 06:16:39
20231018144023	2025-07-19 06:16:41
20231204144023	2025-07-19 06:16:42
20231204144024	2025-07-19 06:16:43
20231204144025	2025-07-19 06:16:44
20240108234812	2025-07-19 06:16:45
20240109165339	2025-07-19 06:16:46
20240227174441	2025-07-19 06:16:47
20240311171622	2025-07-19 06:16:49
20240321100241	2025-07-19 06:16:51
20240401105812	2025-07-19 06:16:53
20240418121054	2025-07-19 06:16:55
20240523004032	2025-07-19 06:16:58
20240618124746	2025-07-19 06:16:59
20240801235015	2025-07-19 06:17:00
20240805133720	2025-07-19 06:17:01
20240827160934	2025-07-19 06:17:02
20240919163303	2025-07-19 06:17:03
20240919163305	2025-07-19 06:17:04
20241019105805	2025-07-19 06:17:05
20241030150047	2025-07-19 06:17:08
20241108114728	2025-07-19 06:17:10
20241121104152	2025-07-19 06:17:11
20241130184212	2025-07-19 06:17:12
20241220035512	2025-07-19 06:17:13
20241220123912	2025-07-19 06:17:14
20241224161212	2025-07-19 06:17:15
20250107150512	2025-07-19 06:17:16
20250110162412	2025-07-19 06:17:16
20250123174212	2025-07-19 06:17:17
20250128220012	2025-07-19 06:17:18
20250506224012	2025-07-19 06:17:19
20250523164012	2025-07-19 06:17:20
20250714121412	2025-07-19 06:17:21
\.


--
-- Data for Name: subscription; Type: TABLE DATA; Schema: realtime; Owner: -
--

COPY "realtime"."subscription" ("id", "subscription_id", "entity", "filters", "claims", "created_at") FROM stdin;
\.


--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."buckets" ("id", "name", "owner", "created_at", "updated_at", "public", "avif_autodetection", "file_size_limit", "allowed_mime_types", "owner_id") FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."migrations" ("id", "name", "hash", "executed_at") FROM stdin;
0	create-migrations-table	e18db593bcde2aca2a408c4d1100f6abba2195df	2025-07-19 06:16:08.263194
1	initialmigration	6ab16121fbaa08bbd11b712d05f358f9b555d777	2025-07-19 06:16:08.270106
2	storage-schema	5c7968fd083fcea04050c1b7f6253c9771b99011	2025-07-19 06:16:08.27536
3	pathtoken-column	2cb1b0004b817b29d5b0a971af16bafeede4b70d	2025-07-19 06:16:08.292923
4	add-migrations-rls	427c5b63fe1c5937495d9c635c263ee7a5905058	2025-07-19 06:16:08.303047
5	add-size-functions	79e081a1455b63666c1294a440f8ad4b1e6a7f84	2025-07-19 06:16:08.308726
6	change-column-name-in-get-size	f93f62afdf6613ee5e7e815b30d02dc990201044	2025-07-19 06:16:08.314923
7	add-rls-to-buckets	e7e7f86adbc51049f341dfe8d30256c1abca17aa	2025-07-19 06:16:08.320747
8	add-public-to-buckets	fd670db39ed65f9d08b01db09d6202503ca2bab3	2025-07-19 06:16:08.326141
9	fix-search-function	3a0af29f42e35a4d101c259ed955b67e1bee6825	2025-07-19 06:16:08.331843
10	search-files-search-function	68dc14822daad0ffac3746a502234f486182ef6e	2025-07-19 06:16:08.337753
11	add-trigger-to-auto-update-updated_at-column	7425bdb14366d1739fa8a18c83100636d74dcaa2	2025-07-19 06:16:08.343754
12	add-automatic-avif-detection-flag	8e92e1266eb29518b6a4c5313ab8f29dd0d08df9	2025-07-19 06:16:08.353387
13	add-bucket-custom-limits	cce962054138135cd9a8c4bcd531598684b25e7d	2025-07-19 06:16:08.358989
14	use-bytes-for-max-size	941c41b346f9802b411f06f30e972ad4744dad27	2025-07-19 06:16:08.364779
15	add-can-insert-object-function	934146bc38ead475f4ef4b555c524ee5d66799e5	2025-07-19 06:16:08.383851
16	add-version	76debf38d3fd07dcfc747ca49096457d95b1221b	2025-07-19 06:16:08.389552
17	drop-owner-foreign-key	f1cbb288f1b7a4c1eb8c38504b80ae2a0153d101	2025-07-19 06:16:08.395037
18	add_owner_id_column_deprecate_owner	e7a511b379110b08e2f214be852c35414749fe66	2025-07-19 06:16:08.401054
19	alter-default-value-objects-id	02e5e22a78626187e00d173dc45f58fa66a4f043	2025-07-19 06:16:08.408757
20	list-objects-with-delimiter	cd694ae708e51ba82bf012bba00caf4f3b6393b7	2025-07-19 06:16:08.414269
21	s3-multipart-uploads	8c804d4a566c40cd1e4cc5b3725a664a9303657f	2025-07-19 06:16:08.422494
22	s3-multipart-uploads-big-ints	9737dc258d2397953c9953d9b86920b8be0cdb73	2025-07-19 06:16:08.436004
23	optimize-search-function	9d7e604cddc4b56a5422dc68c9313f4a1b6f132c	2025-07-19 06:16:08.447887
24	operation-function	8312e37c2bf9e76bbe841aa5fda889206d2bf8aa	2025-07-19 06:16:08.454115
25	custom-metadata	d974c6057c3db1c1f847afa0e291e6165693b990	2025-07-19 06:16:08.459789
\.


--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."objects" ("id", "bucket_id", "name", "owner", "created_at", "updated_at", "last_accessed_at", "metadata", "version", "owner_id", "user_metadata") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."s3_multipart_uploads" ("id", "in_progress_size", "upload_signature", "bucket_id", "key", "version", "owner_id", "created_at", "user_metadata") FROM stdin;
\.


--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: -
--

COPY "storage"."s3_multipart_uploads_parts" ("id", "upload_id", "size", "part_number", "bucket_id", "key", "etag", "owner_id", "version", "created_at") FROM stdin;
\.


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: supabase_migrations; Owner: -
--

COPY "supabase_migrations"."schema_migrations" ("version", "statements", "name", "created_by", "idempotency_key") FROM stdin;
20250720061614	{"ALTER TABLE profiles \nADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();"}	add_created_at_to_profiles	widjayaphilip7@gmail.com	\N
20250721082055	{"-- Drop existing restrictive policies\nDROP POLICY IF EXISTS \\"lesson_students_simple\\" ON lesson_students;\nDROP POLICY IF EXISTS \\"lesson_tutors_simple\\" ON lesson_tutors;\n\n-- Create new policies that allow proper visibility between lesson participants\n\n-- Policy for lesson_students table:\n-- 1. Admins can see all\n-- 2. Students can see other students if they're in the same lesson\n-- 3. Tutors can see students if they're teaching the same lesson\nCREATE POLICY \\"lesson_students_visibility\\" ON lesson_students\n  FOR SELECT\n  USING (\n    get_my_role() = 'admin'\n    OR\n    -- Students can see other students in their lessons\n    (get_my_role() = 'student' AND lesson_id IN (\n      SELECT lesson_id FROM lesson_students WHERE student_id = auth.uid()\n    ))\n    OR\n    -- Tutors can see students in lessons they're teaching\n    (get_my_role() = 'tutor' AND lesson_id IN (\n      SELECT lesson_id FROM lesson_tutors WHERE tutor_id = auth.uid()\n    ))\n  );\n\n-- Policy for lesson_tutors table:\n-- 1. Admins can see all\n-- 2. Tutors can see other tutors if they're in the same lesson  \n-- 3. Students can see tutors if they're in the same lesson\nCREATE POLICY \\"lesson_tutors_visibility\\" ON lesson_tutors\n  FOR SELECT\n  USING (\n    get_my_role() = 'admin'\n    OR\n    -- Tutors can see other tutors in their lessons\n    (get_my_role() = 'tutor' AND lesson_id IN (\n      SELECT lesson_id FROM lesson_tutors WHERE tutor_id = auth.uid()\n    ))\n    OR\n    -- Students can see tutors in lessons they're enrolled in\n    (get_my_role() = 'student' AND lesson_id IN (\n      SELECT lesson_id FROM lesson_students WHERE student_id = auth.uid()\n    ))\n  );"}	fix_lesson_participants_visibility	widjayaphilip7@gmail.com	\N
20250721082146	{"-- Add new policies to profiles table to allow lesson participants to see each other\n\n-- Allow students to see tutors who are teaching in their lessons\nCREATE POLICY \\"students_can_see_tutors_in_their_lessons\\" ON profiles\n  FOR SELECT\n  USING (\n    get_my_role() = 'student' \n    AND role = 'tutor'\n    AND id IN (\n      SELECT lt.tutor_id \n      FROM lesson_tutors lt\n      JOIN lesson_students ls ON lt.lesson_id = ls.lesson_id\n      WHERE ls.student_id = auth.uid()\n    )\n  );\n\n-- Allow students to see other students in their lessons\nCREATE POLICY \\"students_can_see_other_students_in_their_lessons\\" ON profiles\n  FOR SELECT\n  USING (\n    get_my_role() = 'student' \n    AND role = 'student'\n    AND id IN (\n      SELECT ls2.student_id \n      FROM lesson_students ls1\n      JOIN lesson_students ls2 ON ls1.lesson_id = ls2.lesson_id\n      WHERE ls1.student_id = auth.uid()\n    )\n  );\n\n-- Allow tutors to see other tutors in their lessons\nCREATE POLICY \\"tutors_can_see_other_tutors_in_their_lessons\\" ON profiles\n  FOR SELECT\n  USING (\n    get_my_role() = 'tutor' \n    AND role = 'tutor'\n    AND id IN (\n      SELECT lt2.tutor_id \n      FROM lesson_tutors lt1\n      JOIN lesson_tutors lt2 ON lt1.lesson_id = lt2.lesson_id\n      WHERE lt1.tutor_id = auth.uid()\n    )\n  );"}	fix_profiles_visibility_for_lesson_participants	widjayaphilip7@gmail.com	\N
20250721083448	{"\nCREATE OR REPLACE FUNCTION get_my_role()\nRETURNS TEXT AS $$\n  SELECT nullif(current_setting('request.jwt.claims', true), '')::jsonb->>'role';\n$$ LANGUAGE SQL STABLE;\n\nCREATE POLICY \\"Allow students to view all other students\\"\nON public.profiles\nFOR SELECT\nTO authenticated\nUSING (\n  get_my_role() = 'student' AND role = 'student'\n);\n\nALTER TABLE public.profiles\nENABLE ROW LEVEL SECURITY;\n\nGRANT SELECT (id, first_name, last_name, avatar_url) ON public.profiles TO authenticated;\n    "}	recreate_student_view_other_students	widjayaphilip7@gmail.com	\N
20250721083506	{"\nCREATE POLICY \\"Allow students to view all tutors\\"\nON public.profiles\nFOR SELECT\nTO authenticated\nUSING (\n  get_my_role() = 'student' AND role = 'tutor'\n);\n\nGRANT SELECT (id, first_name, last_name, avatar_url, bio, qualifications) ON public.profiles TO authenticated;\n    "}	student_view_tutors	widjayaphilip7@gmail.com	\N
20250721083517	{"\nCREATE POLICY \\"Allow tutors to view all other tutors\\"\nON public.profiles\nFOR SELECT\nTO authenticated\nUSING (\n  get_my_role() = 'tutor' AND role = 'tutor'\n);\n      \nGRANT SELECT (id, first_name, last_name, avatar_url, bio, qualifications) ON public.profiles TO authenticated;\n    "}	tutor_view_other_tutors	widjayaphilip7@gmail.com	\N
20250721083539	{"\nCREATE POLICY \\"Allow tutors to view all students detailed\\"\nON public.profiles\nFOR SELECT\nTO authenticated\nUSING (\n  get_my_role() = 'tutor' AND role = 'student'\n);\n\nGRANT SELECT (id, first_name, last_name, avatar_url, contact_email, phone_number, school_name, vce_year_level, parent_guardian_name, parent_guardian_email, parent_guardian_phone) ON public.profiles TO authenticated;\n    "}	tutor_view_students_detailed	widjayaphilip7@gmail.com	\N
\.


--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: -
--

COPY "vault"."secrets" ("id", "name", "description", "secret", "key_id", "nonce", "created_at", "updated_at") FROM stdin;
\.


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: -
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 83, true);


--
-- Name: subscription_id_seq; Type: SEQUENCE SET; Schema: realtime; Owner: -
--

SELECT pg_catalog.setval('"realtime"."subscription_id_seq"', 1, false);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_amr_claims"
    ADD CONSTRAINT "amr_id_pk" PRIMARY KEY ("id");


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."audit_log_entries"
    ADD CONSTRAINT "audit_log_entries_pkey" PRIMARY KEY ("id");


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."flow_state"
    ADD CONSTRAINT "flow_state_pkey" PRIMARY KEY ("id");


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."identities"
    ADD CONSTRAINT "identities_pkey" PRIMARY KEY ("id");


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."identities"
    ADD CONSTRAINT "identities_provider_id_provider_unique" UNIQUE ("provider_id", "provider");


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."instances"
    ADD CONSTRAINT "instances_pkey" PRIMARY KEY ("id");


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_amr_claims"
    ADD CONSTRAINT "mfa_amr_claims_session_id_authentication_method_pkey" UNIQUE ("session_id", "authentication_method");


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_challenges"
    ADD CONSTRAINT "mfa_challenges_pkey" PRIMARY KEY ("id");


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_factors"
    ADD CONSTRAINT "mfa_factors_last_challenged_at_key" UNIQUE ("last_challenged_at");


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_factors"
    ADD CONSTRAINT "mfa_factors_pkey" PRIMARY KEY ("id");


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."one_time_tokens"
    ADD CONSTRAINT "one_time_tokens_pkey" PRIMARY KEY ("id");


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id");


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_token_unique" UNIQUE ("token");


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_providers"
    ADD CONSTRAINT "saml_providers_entity_id_key" UNIQUE ("entity_id");


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_providers"
    ADD CONSTRAINT "saml_providers_pkey" PRIMARY KEY ("id");


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_relay_states"
    ADD CONSTRAINT "saml_relay_states_pkey" PRIMARY KEY ("id");


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."schema_migrations"
    ADD CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version");


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sessions"
    ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sso_domains"
    ADD CONSTRAINT "sso_domains_pkey" PRIMARY KEY ("id");


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sso_providers"
    ADD CONSTRAINT "sso_providers_pkey" PRIMARY KEY ("id");


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."users"
    ADD CONSTRAINT "users_phone_key" UNIQUE ("phone");


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");


--
-- Name: campuses campuses_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."campuses"
    ADD CONSTRAINT "campuses_name_key" UNIQUE ("name");


--
-- Name: campuses campuses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."campuses"
    ADD CONSTRAINT "campuses_pkey" PRIMARY KEY ("id");


--
-- Name: enrolments enrolments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."enrolments"
    ADD CONSTRAINT "enrolments_pkey" PRIMARY KEY ("student_id", "subject_id");


--
-- Name: lesson_students lesson_students_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."lesson_students"
    ADD CONSTRAINT "lesson_students_pkey" PRIMARY KEY ("lesson_id", "student_id");


--
-- Name: lesson_tutors lesson_tutors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."lesson_tutors"
    ADD CONSTRAINT "lesson_tutors_pkey" PRIMARY KEY ("lesson_id", "tutor_id");


--
-- Name: lessons lessons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."lessons"
    ADD CONSTRAINT "lessons_pkey" PRIMARY KEY ("id");


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");


--
-- Name: rooms rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."rooms"
    ADD CONSTRAINT "rooms_pkey" PRIMARY KEY ("id");


--
-- Name: subjects subjects_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."subjects"
    ADD CONSTRAINT "subjects_code_key" UNIQUE ("code");


--
-- Name: subjects subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."subjects"
    ADD CONSTRAINT "subjects_pkey" PRIMARY KEY ("id");


--
-- Name: tutor_subjects tutor_subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."tutor_subjects"
    ADD CONSTRAINT "tutor_subjects_pkey" PRIMARY KEY ("tutor_id", "subject_id");


--
-- Name: rooms unique_room_per_campus; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."rooms"
    ADD CONSTRAINT "unique_room_per_campus" UNIQUE ("campus_id", "name");


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id", "inserted_at");


--
-- Name: subscription pk_subscription; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."subscription"
    ADD CONSTRAINT "pk_subscription" PRIMARY KEY ("id");


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: realtime; Owner: -
--

ALTER TABLE ONLY "realtime"."schema_migrations"
    ADD CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version");


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."buckets"
    ADD CONSTRAINT "buckets_pkey" PRIMARY KEY ("id");


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."migrations"
    ADD CONSTRAINT "migrations_name_key" UNIQUE ("name");


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."migrations"
    ADD CONSTRAINT "migrations_pkey" PRIMARY KEY ("id");


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."objects"
    ADD CONSTRAINT "objects_pkey" PRIMARY KEY ("id");


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads_parts"
    ADD CONSTRAINT "s3_multipart_uploads_parts_pkey" PRIMARY KEY ("id");


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads"
    ADD CONSTRAINT "s3_multipart_uploads_pkey" PRIMARY KEY ("id");


--
-- Name: schema_migrations schema_migrations_idempotency_key_key; Type: CONSTRAINT; Schema: supabase_migrations; Owner: -
--

ALTER TABLE ONLY "supabase_migrations"."schema_migrations"
    ADD CONSTRAINT "schema_migrations_idempotency_key_key" UNIQUE ("idempotency_key");


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: supabase_migrations; Owner: -
--

ALTER TABLE ONLY "supabase_migrations"."schema_migrations"
    ADD CONSTRAINT "schema_migrations_pkey" PRIMARY KEY ("version");


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "audit_logs_instance_id_idx" ON "auth"."audit_log_entries" USING "btree" ("instance_id");


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "confirmation_token_idx" ON "auth"."users" USING "btree" ("confirmation_token") WHERE (("confirmation_token")::"text" !~ '^[0-9 ]*$'::"text");


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "email_change_token_current_idx" ON "auth"."users" USING "btree" ("email_change_token_current") WHERE (("email_change_token_current")::"text" !~ '^[0-9 ]*$'::"text");


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "email_change_token_new_idx" ON "auth"."users" USING "btree" ("email_change_token_new") WHERE (("email_change_token_new")::"text" !~ '^[0-9 ]*$'::"text");


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "factor_id_created_at_idx" ON "auth"."mfa_factors" USING "btree" ("user_id", "created_at");


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "flow_state_created_at_idx" ON "auth"."flow_state" USING "btree" ("created_at" DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "identities_email_idx" ON "auth"."identities" USING "btree" ("email" "text_pattern_ops");


--
-- Name: INDEX "identities_email_idx"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX "auth"."identities_email_idx" IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "identities_user_id_idx" ON "auth"."identities" USING "btree" ("user_id");


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "idx_auth_code" ON "auth"."flow_state" USING "btree" ("auth_code");


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "idx_user_id_auth_method" ON "auth"."flow_state" USING "btree" ("user_id", "authentication_method");


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "mfa_challenge_created_at_idx" ON "auth"."mfa_challenges" USING "btree" ("created_at" DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "mfa_factors_user_friendly_name_unique" ON "auth"."mfa_factors" USING "btree" ("friendly_name", "user_id") WHERE (TRIM(BOTH FROM "friendly_name") <> ''::"text");


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "mfa_factors_user_id_idx" ON "auth"."mfa_factors" USING "btree" ("user_id");


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "one_time_tokens_relates_to_hash_idx" ON "auth"."one_time_tokens" USING "hash" ("relates_to");


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "one_time_tokens_token_hash_hash_idx" ON "auth"."one_time_tokens" USING "hash" ("token_hash");


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "one_time_tokens_user_id_token_type_key" ON "auth"."one_time_tokens" USING "btree" ("user_id", "token_type");


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "reauthentication_token_idx" ON "auth"."users" USING "btree" ("reauthentication_token") WHERE (("reauthentication_token")::"text" !~ '^[0-9 ]*$'::"text");


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "recovery_token_idx" ON "auth"."users" USING "btree" ("recovery_token") WHERE (("recovery_token")::"text" !~ '^[0-9 ]*$'::"text");


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "refresh_tokens_instance_id_idx" ON "auth"."refresh_tokens" USING "btree" ("instance_id");


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "refresh_tokens_instance_id_user_id_idx" ON "auth"."refresh_tokens" USING "btree" ("instance_id", "user_id");


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "refresh_tokens_parent_idx" ON "auth"."refresh_tokens" USING "btree" ("parent");


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "refresh_tokens_session_id_revoked_idx" ON "auth"."refresh_tokens" USING "btree" ("session_id", "revoked");


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "refresh_tokens_updated_at_idx" ON "auth"."refresh_tokens" USING "btree" ("updated_at" DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "saml_providers_sso_provider_id_idx" ON "auth"."saml_providers" USING "btree" ("sso_provider_id");


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "saml_relay_states_created_at_idx" ON "auth"."saml_relay_states" USING "btree" ("created_at" DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "saml_relay_states_for_email_idx" ON "auth"."saml_relay_states" USING "btree" ("for_email");


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "saml_relay_states_sso_provider_id_idx" ON "auth"."saml_relay_states" USING "btree" ("sso_provider_id");


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "sessions_not_after_idx" ON "auth"."sessions" USING "btree" ("not_after" DESC);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "sessions_user_id_idx" ON "auth"."sessions" USING "btree" ("user_id");


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "sso_domains_domain_idx" ON "auth"."sso_domains" USING "btree" ("lower"("domain"));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "sso_domains_sso_provider_id_idx" ON "auth"."sso_domains" USING "btree" ("sso_provider_id");


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "sso_providers_resource_id_idx" ON "auth"."sso_providers" USING "btree" ("lower"("resource_id"));


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "unique_phone_factor_per_user" ON "auth"."mfa_factors" USING "btree" ("user_id", "phone");


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "user_id_created_at_idx" ON "auth"."sessions" USING "btree" ("user_id", "created_at");


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX "users_email_partial_key" ON "auth"."users" USING "btree" ("email") WHERE ("is_sso_user" = false);


--
-- Name: INDEX "users_email_partial_key"; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX "auth"."users_email_partial_key" IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "users_instance_id_email_idx" ON "auth"."users" USING "btree" ("instance_id", "lower"(("email")::"text"));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "users_instance_id_idx" ON "auth"."users" USING "btree" ("instance_id");


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX "users_is_anonymous_idx" ON "auth"."users" USING "btree" ("is_anonymous");


--
-- Name: ix_realtime_subscription_entity; Type: INDEX; Schema: realtime; Owner: -
--

CREATE INDEX "ix_realtime_subscription_entity" ON "realtime"."subscription" USING "btree" ("entity");


--
-- Name: subscription_subscription_id_entity_filters_key; Type: INDEX; Schema: realtime; Owner: -
--

CREATE UNIQUE INDEX "subscription_subscription_id_entity_filters_key" ON "realtime"."subscription" USING "btree" ("subscription_id", "entity", "filters");


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX "bname" ON "storage"."buckets" USING "btree" ("name");


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX "bucketid_objname" ON "storage"."objects" USING "btree" ("bucket_id", "name");


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX "idx_multipart_uploads_list" ON "storage"."s3_multipart_uploads" USING "btree" ("bucket_id", "key", "created_at");


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX "idx_objects_bucket_id_name" ON "storage"."objects" USING "btree" ("bucket_id", "name" COLLATE "C");


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX "name_prefix_search" ON "storage"."objects" USING "btree" ("name" "text_pattern_ops");


--
-- Name: subscription tr_check_filters; Type: TRIGGER; Schema: realtime; Owner: -
--

CREATE TRIGGER "tr_check_filters" BEFORE INSERT OR UPDATE ON "realtime"."subscription" FOR EACH ROW EXECUTE FUNCTION "realtime"."subscription_check_filters"();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER "update_objects_updated_at" BEFORE UPDATE ON "storage"."objects" FOR EACH ROW EXECUTE FUNCTION "storage"."update_updated_at_column"();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."identities"
    ADD CONSTRAINT "identities_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_amr_claims"
    ADD CONSTRAINT "mfa_amr_claims_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_challenges"
    ADD CONSTRAINT "mfa_challenges_auth_factor_id_fkey" FOREIGN KEY ("factor_id") REFERENCES "auth"."mfa_factors"("id") ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."mfa_factors"
    ADD CONSTRAINT "mfa_factors_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."one_time_tokens"
    ADD CONSTRAINT "one_time_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."refresh_tokens"
    ADD CONSTRAINT "refresh_tokens_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "auth"."sessions"("id") ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_providers"
    ADD CONSTRAINT "saml_providers_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_relay_states"
    ADD CONSTRAINT "saml_relay_states_flow_state_id_fkey" FOREIGN KEY ("flow_state_id") REFERENCES "auth"."flow_state"("id") ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."saml_relay_states"
    ADD CONSTRAINT "saml_relay_states_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sessions"
    ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY "auth"."sso_domains"
    ADD CONSTRAINT "sso_domains_sso_provider_id_fkey" FOREIGN KEY ("sso_provider_id") REFERENCES "auth"."sso_providers"("id") ON DELETE CASCADE;


--
-- Name: enrolments enrolments_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."enrolments"
    ADD CONSTRAINT "enrolments_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;


--
-- Name: enrolments enrolments_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."enrolments"
    ADD CONSTRAINT "enrolments_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE CASCADE;


--
-- Name: lesson_students lesson_students_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."lesson_students"
    ADD CONSTRAINT "lesson_students_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE CASCADE;


--
-- Name: lesson_students lesson_students_student_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."lesson_students"
    ADD CONSTRAINT "lesson_students_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;


--
-- Name: lesson_tutors lesson_tutors_lesson_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."lesson_tutors"
    ADD CONSTRAINT "lesson_tutors_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "public"."lessons"("id") ON DELETE CASCADE;


--
-- Name: lesson_tutors lesson_tutors_tutor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."lesson_tutors"
    ADD CONSTRAINT "lesson_tutors_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;


--
-- Name: lessons lessons_campus_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."lessons"
    ADD CONSTRAINT "lessons_campus_id_fkey" FOREIGN KEY ("campus_id") REFERENCES "public"."campuses"("id") ON DELETE SET NULL;


--
-- Name: lessons lessons_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."lessons"
    ADD CONSTRAINT "lessons_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;


--
-- Name: lessons lessons_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."lessons"
    ADD CONSTRAINT "lessons_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "public"."rooms"("id") ON DELETE SET NULL;


--
-- Name: lessons lessons_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."lessons"
    ADD CONSTRAINT "lessons_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;


--
-- Name: rooms rooms_campus_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."rooms"
    ADD CONSTRAINT "rooms_campus_id_fkey" FOREIGN KEY ("campus_id") REFERENCES "public"."campuses"("id") ON DELETE CASCADE;


--
-- Name: tutor_subjects tutor_subjects_subject_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."tutor_subjects"
    ADD CONSTRAINT "tutor_subjects_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE CASCADE;


--
-- Name: tutor_subjects tutor_subjects_tutor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."tutor_subjects"
    ADD CONSTRAINT "tutor_subjects_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."objects"
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads"
    ADD CONSTRAINT "s3_multipart_uploads_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads_parts"
    ADD CONSTRAINT "s3_multipart_uploads_parts_bucket_id_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id");


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY "storage"."s3_multipart_uploads_parts"
    ADD CONSTRAINT "s3_multipart_uploads_parts_upload_id_fkey" FOREIGN KEY ("upload_id") REFERENCES "storage"."s3_multipart_uploads"("id") ON DELETE CASCADE;


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."audit_log_entries" ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."flow_state" ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."identities" ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."instances" ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."mfa_amr_claims" ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."mfa_challenges" ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."mfa_factors" ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."one_time_tokens" ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."refresh_tokens" ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."saml_providers" ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."saml_relay_states" ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."schema_migrations" ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."sessions" ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."sso_domains" ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."sso_providers" ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE "auth"."users" ENABLE ROW LEVEL SECURITY;

--
-- Name: lesson_students Admins and Tutors can manage lesson students; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and Tutors can manage lesson students" ON "public"."lesson_students" USING (("public"."get_my_role"() = ANY (ARRAY['admin'::"text", 'tutor'::"text"]))) WITH CHECK (("public"."get_my_role"() = ANY (ARRAY['admin'::"text", 'tutor'::"text"])));


--
-- Name: lesson_tutors Admins and Tutors can manage lesson tutors; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins and Tutors can manage lesson tutors" ON "public"."lesson_tutors" USING (("public"."get_my_role"() = ANY (ARRAY['admin'::"text", 'tutor'::"text"]))) WITH CHECK (("public"."get_my_role"() = ANY (ARRAY['admin'::"text", 'tutor'::"text"])));


--
-- Name: profiles Admins can manage all profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Admins can manage all profiles" ON "public"."profiles" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());


--
-- Name: enrolments Allow admins to manage all enrolments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow admins to manage all enrolments" ON "public"."enrolments" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());


--
-- Name: campuses Allow admins to manage campuses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow admins to manage campuses" ON "public"."campuses" USING (("public"."get_my_role"() = 'admin'::"text")) WITH CHECK (("public"."get_my_role"() = 'admin'::"text"));


--
-- Name: rooms Allow admins to manage rooms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow admins to manage rooms" ON "public"."rooms" USING (("public"."get_my_role"() = 'admin'::"text")) WITH CHECK (("public"."get_my_role"() = 'admin'::"text"));


--
-- Name: subjects Allow admins to manage subjects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow admins to manage subjects" ON "public"."subjects" USING ("public"."is_admin"()) WITH CHECK ("public"."is_admin"());


--
-- Name: tutor_subjects Allow admins to manage tutor assignments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow admins to manage tutor assignments" ON "public"."tutor_subjects" USING (("public"."get_my_role"() = 'admin'::"text")) WITH CHECK (("public"."get_my_role"() = 'admin'::"text"));


--
-- Name: subjects Allow authenticated users to view all subjects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow authenticated users to view all subjects" ON "public"."subjects" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: campuses Allow authenticated users to view campuses; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow authenticated users to view campuses" ON "public"."campuses" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: rooms Allow authenticated users to view rooms; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow authenticated users to view rooms" ON "public"."rooms" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: tutor_subjects Allow authenticated users to view tutor assignments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow authenticated users to view tutor assignments" ON "public"."tutor_subjects" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));


--
-- Name: enrolments Allow students to see their own enrolments; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow students to see their own enrolments" ON "public"."enrolments" FOR SELECT USING (("student_id" = "auth"."uid"()));


--
-- Name: enrolments Allow tutors to see enrolments for their subjects; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow tutors to see enrolments for their subjects" ON "public"."enrolments" FOR SELECT USING (("subject_id" IN ( SELECT DISTINCT "l"."subject_id"
   FROM ("public"."lessons" "l"
     JOIN "public"."lesson_tutors" "lt" ON (("l"."id" = "lt"."lesson_id")))
  WHERE ("lt"."tutor_id" = "auth"."uid"()))));


--
-- Name: lessons Everyone can view all lessons; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Everyone can view all lessons" ON "public"."lessons" FOR SELECT USING (true);


--
-- Name: profiles Everyone can view all profiles; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Everyone can view all profiles" ON "public"."profiles" FOR SELECT USING (true);


--
-- Name: lesson_students Everyone can view lesson students; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Everyone can view lesson students" ON "public"."lesson_students" FOR SELECT USING (true);


--
-- Name: lesson_tutors Everyone can view lesson tutors; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Everyone can view lesson tutors" ON "public"."lesson_tutors" FOR SELECT USING (true);


--
-- Name: lessons Tutors and Admins can create lessons; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Tutors and Admins can create lessons" ON "public"."lessons" FOR INSERT WITH CHECK (("public"."is_admin"() OR (("public"."get_my_role"() = 'tutor'::"text") AND ("subject_id" IN ( SELECT "ts"."subject_id"
   FROM "public"."tutor_subjects" "ts"
  WHERE ("ts"."tutor_id" = "auth"."uid"()))))));


--
-- Name: lessons Tutors and Admins can delete lessons; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Tutors and Admins can delete lessons" ON "public"."lessons" FOR DELETE USING (("public"."is_admin"() OR ("public"."get_my_role"() = 'tutor'::"text")));


--
-- Name: lessons Tutors and Admins can update lessons; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Tutors and Admins can update lessons" ON "public"."lessons" FOR UPDATE USING (("public"."is_admin"() OR ("public"."get_my_role"() = 'tutor'::"text")));


--
-- Name: profiles Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id")) WITH CHECK (("auth"."uid"() = "id"));


--
-- Name: campuses; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."campuses" ENABLE ROW LEVEL SECURITY;

--
-- Name: enrolments; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."enrolments" ENABLE ROW LEVEL SECURITY;

--
-- Name: lesson_students; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."lesson_students" ENABLE ROW LEVEL SECURITY;

--
-- Name: lesson_tutors; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."lesson_tutors" ENABLE ROW LEVEL SECURITY;

--
-- Name: lessons; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."lessons" ENABLE ROW LEVEL SECURITY;

--
-- Name: profiles; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;

--
-- Name: rooms; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."rooms" ENABLE ROW LEVEL SECURITY;

--
-- Name: subjects; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."subjects" ENABLE ROW LEVEL SECURITY;

--
-- Name: tutor_subjects; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE "public"."tutor_subjects" ENABLE ROW LEVEL SECURITY;

--
-- Name: messages; Type: ROW SECURITY; Schema: realtime; Owner: -
--

ALTER TABLE "realtime"."messages" ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."buckets" ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."migrations" ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."s3_multipart_uploads" ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE "storage"."s3_multipart_uploads_parts" ENABLE ROW LEVEL SECURITY;

--
-- Name: supabase_realtime; Type: PUBLICATION; Schema: -; Owner: -
--

CREATE PUBLICATION "supabase_realtime" WITH (publish = 'insert, update, delete, truncate');


--
-- Name: issue_graphql_placeholder; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER "issue_graphql_placeholder" ON "sql_drop"
         WHEN TAG IN ('DROP EXTENSION')
   EXECUTE FUNCTION "extensions"."set_graphql_placeholder"();


--
-- Name: issue_pg_cron_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER "issue_pg_cron_access" ON "ddl_command_end"
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION "extensions"."grant_pg_cron_access"();


--
-- Name: issue_pg_graphql_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER "issue_pg_graphql_access" ON "ddl_command_end"
         WHEN TAG IN ('CREATE FUNCTION')
   EXECUTE FUNCTION "extensions"."grant_pg_graphql_access"();


--
-- Name: issue_pg_net_access; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER "issue_pg_net_access" ON "ddl_command_end"
         WHEN TAG IN ('CREATE EXTENSION')
   EXECUTE FUNCTION "extensions"."grant_pg_net_access"();


--
-- Name: pgrst_ddl_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER "pgrst_ddl_watch" ON "ddl_command_end"
   EXECUTE FUNCTION "extensions"."pgrst_ddl_watch"();


--
-- Name: pgrst_drop_watch; Type: EVENT TRIGGER; Schema: -; Owner: -
--

CREATE EVENT TRIGGER "pgrst_drop_watch" ON "sql_drop"
   EXECUTE FUNCTION "extensions"."pgrst_drop_watch"();


--
-- PostgreSQL database dump complete
--

