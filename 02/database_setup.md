# BravoOS Database Setup Guide

Use this guide to recreate the BravoOS database and data in pgAdmin on a new computer.

## Part 1: Initial Setup

Run this block in pgAdmin Query Tool (while connected to the `postgres` database):

```sql
CREATE DATABASE bravoos_db;

-- IMPORTANT: After running above, open a NEW Query Tool window
-- connected to the newly created 'bravoos_db' database before running the rest.
```

## Part 2: Table Structures (Schema)

Run this block to create all tables.

```sql
-- Table: accounts_user
CREATE TABLE accounts_user (
    id bigint NOT NULL,
    password character varying(128) NOT NULL,
    last_login timestamp with time zone,
    is_superuser boolean NOT NULL,
    first_name character varying(150) NOT NULL,
    last_name character varying(150) NOT NULL,
    is_staff boolean NOT NULL,
    is_active boolean NOT NULL,
    date_joined timestamp with time zone NOT NULL,
    email character varying(254) NOT NULL,
    role character varying(20) NOT NULL,
    phone character varying(20),
    branch_id uuid,
    status character varying(20) NOT NULL,
    full_name character varying(255),
    full_name_az character varying(255)
);

-- Table: accounts_user_groups
CREATE TABLE accounts_user_groups (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    group_id integer NOT NULL
);

-- Table: accounts_user_user_permissions
CREATE TABLE accounts_user_user_permissions (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    permission_id integer NOT NULL
);

-- Table: inventory_alert
CREATE TABLE inventory_alert (
    id uuid NOT NULL,
    alert_level character varying(20) NOT NULL,
    quantity_at_risk integer NOT NULL,
    estimated_loss numeric NOT NULL,
    expiry_days_left integer NOT NULL,
    ai_recommendation text NOT NULL,
    recommended_action character varying(50) NOT NULL,
    confidence_score integer NOT NULL,
    status character varying(20) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    branch_id uuid NOT NULL,
    product_id uuid NOT NULL,
    stock_item_id uuid NOT NULL
);

-- Table: inventory_branch
CREATE TABLE inventory_branch (
    id uuid NOT NULL,
    branch_code character varying(20) NOT NULL,
    name character varying(100) NOT NULL,
    name_az character varying(100),
    city character varying(50) NOT NULL,
    city_az character varying(50),
    address text NOT NULL,
    address_az text,
    phone character varying(20) NOT NULL,
    email character varying(100),
    opening_time time without time zone NOT NULL,
    closing_time time without time zone NOT NULL,
    timezone character varying(50) NOT NULL,
    status character varying(20) NOT NULL,
    risk_score numeric NOT NULL,
    fefo_compliance_score numeric NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);

-- Table: inventory_category
CREATE TABLE inventory_category (
    id uuid NOT NULL,
    name character varying(50) NOT NULL,
    name_az character varying(50),
    description text,
    is_active boolean NOT NULL,
    created_at timestamp with time zone NOT NULL,
    parent_category_id uuid
);

-- Table: inventory_product
CREATE TABLE inventory_product (
    id uuid NOT NULL,
    sku character varying(50) NOT NULL,
    barcode character varying(100),
    name character varying(200) NOT NULL,
    name_az character varying(200),
    description text,
    unit character varying(20) NOT NULL,
    unit_az character varying(20),
    cost_price numeric NOT NULL,
    selling_price numeric NOT NULL,
    min_stock_level integer NOT NULL,
    max_stock_level integer NOT NULL,
    reorder_point integer NOT NULL,
    lead_time_days integer NOT NULL,
    storage_requirements jsonb NOT NULL,
    is_perishable boolean NOT NULL,
    shelf_life_days integer,
    is_active boolean NOT NULL,
    image_url text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    category_id uuid
);

-- Table: inventory_stockitem
CREATE TABLE inventory_stockitem (
    id uuid NOT NULL,
    batch_number character varying(100) NOT NULL,
    quantity integer NOT NULL,
    received_quantity integer NOT NULL,
    damaged_quantity integer NOT NULL,
    expiry_date date NOT NULL,
    received_date date NOT NULL,
    storage_location character varying(100),
    storage_zone character varying(50),
    status character varying(20) NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    branch_id uuid NOT NULL,
    product_id uuid NOT NULL
);

-- Table: inventory_transfer
CREATE TABLE inventory_transfer (
    id uuid NOT NULL,
    quantity integer NOT NULL,
    status character varying(20) NOT NULL,
    reason text NOT NULL,
    driver_name character varying(100),
    eta character varying(100),
    delivered_at timestamp with time zone,
    received_at timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    from_branch_id uuid NOT NULL,
    product_id uuid NOT NULL,
    received_by_id bigint,
    stock_item_id uuid,
    to_branch_id uuid NOT NULL
);

-- Table: supply_chain_invoice
CREATE TABLE supply_chain_invoice (
    id bigint NOT NULL,
    code character varying(50) NOT NULL,
    amount numeric NOT NULL,
    due_date date NOT NULL,
    received_date date,
    status character varying(20) NOT NULL,
    match_status character varying(100) NOT NULL,
    match_results jsonb NOT NULL,
    po_id bigint NOT NULL
);

-- Table: supply_chain_purchaseorder
CREATE TABLE supply_chain_purchaseorder (
    id bigint NOT NULL,
    code character varying(50) NOT NULL,
    amount numeric NOT NULL,
    date date NOT NULL,
    status character varying(20) NOT NULL,
    items jsonb NOT NULL,
    branch_id uuid NOT NULL,
    vendor_id bigint NOT NULL
);

-- Table: supply_chain_vendor
CREATE TABLE supply_chain_vendor (
    id bigint NOT NULL,
    name character varying(200) NOT NULL,
    contact_person character varying(200) NOT NULL,
    email character varying(254) NOT NULL,
    phone character varying(50) NOT NULL,
    address text NOT NULL,
    categories jsonb NOT NULL,
    lead_time integer NOT NULL,
    payment_terms character varying(100) NOT NULL,
    rating double precision NOT NULL,
    status character varying(20) NOT NULL,
    since date NOT NULL,
    on_time_rate integer NOT NULL,
    quality_score integer NOT NULL,
    fill_rate integer NOT NULL,
    avg_response character varying(50) NOT NULL,
    name_az character varying(200),
    tax_number character varying(50),
    vendor_code character varying(20)
);

-- Table: tasks_task
CREATE TABLE tasks_task (
    id uuid NOT NULL,
    title character varying(200) NOT NULL,
    description text NOT NULL,
    priority character varying(20) NOT NULL,
    status character varying(20) NOT NULL,
    due_date timestamp with time zone,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    assigned_to_id bigint,
    branch_id uuid NOT NULL,
    created_by_id bigint
);

-- Table: shifts_shift
CREATE TABLE shifts_shift (
    id uuid NOT NULL,
    start_time timestamp with time zone NOT NULL,
    end_time timestamp with time zone,
    status character varying(20) NOT NULL,
    notes text,
    branch_id uuid NOT NULL,
    user_id bigint NOT NULL
);

-- Table: shifts_shiftrequest
CREATE TABLE shifts_shiftrequest (
    id uuid NOT NULL,
    request_type character varying(20) NOT NULL,
    status character varying(20) NOT NULL,
    priority character varying(20) NOT NULL,
    title character varying(200) NOT NULL,
    description text NOT NULL,
    response text,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    responded_by_id bigint,
    shift_id uuid,
    user_id bigint NOT NULL
);

-- Table: waste_management_wasterecord
CREATE TABLE waste_management_wasterecord (
    id uuid NOT NULL,
    quantity integer NOT NULL,
    reason character varying(100) NOT NULL,
    notes text,
    logged_at timestamp with time zone NOT NULL,
    branch_id uuid NOT NULL,
    logged_by_id bigint,
    stock_item_id uuid NOT NULL
);

```

## Part 3: Data Inserts

Run these blocks to populate the database with real data.

### Data for accounts_user
```sql
INSERT INTO accounts_user (id, password, last_login, is_superuser, first_name, last_name, is_staff, is_active, date_joined, email, role, phone, branch_id, status, full_name, full_name_az) VALUES (1, 'pbkdf2_sha256$720000$c9ekgrTLvNaEcrufCQqV94$wjXdVls+C/YQ5UkO8AtotleoiOmUFN77NqFwTRJuiwA=', NULL, True, '', '', True, True, '2026-05-13 21:53:45.493575-07:00', 'bravoos001@gmail.com', 'admin', NULL, NULL, 'active', NULL, NULL);
INSERT INTO accounts_user (id, password, last_login, is_superuser, first_name, last_name, is_staff, is_active, date_joined, email, role, phone, branch_id, status, full_name, full_name_az) VALUES (5, 'pbkdf2_sha256$720000$3PY3Gce6Zaj7vNC6YW5D1n$vhpCiIY0eSAu/e6fL861yls4aGVqETlfFfZ+esQjCnc=', NULL, False, '', '', False, True, '2026-05-14 04:02:08.102649-07:00', 'manager.narimanov@bravoos.az', 'manager', NULL, '04c4dbd7-3d17-46bb-814d-e7d3111577ac', 'active', 'Vugar Aliyev', 'Vüqar Əliyev');
INSERT INTO accounts_user (id, password, last_login, is_superuser, first_name, last_name, is_staff, is_active, date_joined, email, role, phone, branch_id, status, full_name, full_name_az) VALUES (6, 'pbkdf2_sha256$720000$ZfOklZRyDRlTovVJqY2k37$mtWIDj2FKMr/joJDu6pe6sSWpgQAaAriozJlj/0XYI0=', NULL, False, '', '', False, True, '2026-05-14 06:07:27.470813-07:00', 'staff.downtown@bravoos.az', 'staff', NULL, '0130b83e-5e0a-4ed6-bc12-4fdc08f46c27', 'active', 'Sara Johnson', NULL);
INSERT INTO accounts_user (id, password, last_login, is_superuser, first_name, last_name, is_staff, is_active, date_joined, email, role, phone, branch_id, status, full_name, full_name_az) VALUES (3, 'pbkdf2_sha256$720000$BN9TODnuBOod6zyLBOJHNg$vuoP8Nww+hee6x7J/O4XmM9yjGekztjhTqgQge9xL9c=', NULL, False, '', '', False, True, '2026-05-14 04:02:07.330188-07:00', 'manager.khatai@bravoos.az', 'manager', NULL, '336c28f2-4d43-4b4f-a659-bb157c5ca432', 'active', 'Rustam Mammadov', 'Rüstəm Məmmədov');
INSERT INTO accounts_user (id, password, last_login, is_superuser, first_name, last_name, is_staff, is_active, date_joined, email, role, phone, branch_id, status, full_name, full_name_az) VALUES (4, 'pbkdf2_sha256$720000$yHm01gqZ1N8YzRZFFlmiRI$5bCr9f/VPk4HsuK7puEjK9tlht1iYOvmRn3HktSb1XY=', NULL, False, '', '', False, True, '2026-05-14 04:02:07.739214-07:00', 'manager.yasamal@bravoos.az', 'manager', NULL, '0130b83e-5e0a-4ed6-bc12-4fdc08f46c27', 'active', 'Zeynab Hasanova', 'Zeynəb Həsənova');
INSERT INTO accounts_user (id, password, last_login, is_superuser, first_name, last_name, is_staff, is_active, date_joined, email, role, phone, branch_id, status, full_name, full_name_az) VALUES (2, 'pbkdf2_sha256$720000$i5g4OlhK8stuZ2AAN59BeX$CTYQV2TTc3RaKCoprPLJooc03WKAv0qslCHOYwyf734=', NULL, True, '', '', True, True, '2026-05-13 22:39:35.870012-07:00', 'admin@bravoos.az', 'admin', NULL, NULL, 'active', NULL, NULL);
```

### Data for accounts_user_groups
```sql
-- No data in accounts_user_groups
```

### Data for accounts_user_user_permissions
```sql
-- No data in accounts_user_user_permissions
```

### Data for inventory_alert
```sql
INSERT INTO inventory_alert (id, alert_level, quantity_at_risk, estimated_loss, expiry_days_left, ai_recommendation, recommended_action, confidence_score, status, created_at, branch_id, product_id, stock_item_id) VALUES ('6a364e2f-edc3-4364-a4e9-5ff4a59a3dd8', 'high', 26, '50.96', 14, 'Monitor closely', 'DISCOUNT', 85, 'active', '2026-05-14 00:09:12.235974-07:00', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', '8e4f6089-c842-413f-9bed-724197c8324f', '11aeac0f-991a-41d0-8743-8a1f99549b4b');
INSERT INTO inventory_alert (id, alert_level, quantity_at_risk, estimated_loss, expiry_days_left, ai_recommendation, recommended_action, confidence_score, status, created_at, branch_id, product_id, stock_item_id) VALUES ('ceaa4d94-d5ce-40be-b966-4a495dec68b0', 'critical', 73, '204.40', 3, 'Monitor closely', 'DISCOUNT', 85, 'active', '2026-05-14 00:09:12.507612-07:00', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', 'ad5544f3-ece8-4858-ad83-99afbbdaaa9d', '6f9473ce-fe9a-465e-8436-5963adf66280');
INSERT INTO inventory_alert (id, alert_level, quantity_at_risk, estimated_loss, expiry_days_left, ai_recommendation, recommended_action, confidence_score, status, created_at, branch_id, product_id, stock_item_id) VALUES ('5f061dac-42ae-4e78-be17-4e7d716de07f', 'critical', 47, '131.60', 3, 'Monitor closely', 'DISCOUNT', 85, 'active', '2026-05-14 00:09:12.786181-07:00', 'e70b410d-d4c3-48d0-a72d-0e7c22c9ab02', 'ad5544f3-ece8-4858-ad83-99afbbdaaa9d', '959015a2-8c6f-443d-aaae-2ab2cc3e296b');
INSERT INTO inventory_alert (id, alert_level, quantity_at_risk, estimated_loss, expiry_days_left, ai_recommendation, recommended_action, confidence_score, status, created_at, branch_id, product_id, stock_item_id) VALUES ('2fc6bcbb-93c1-4f79-ada6-800580e51787', 'high', 100, '150.00', 5, 'Monitor closely', 'DISCOUNT', 85, 'active', '2026-05-14 00:09:13.067970-07:00', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', '0aab8559-7f49-4f91-b72b-a67d51013cd2', 'f2c1f3dc-be18-4f09-9752-c54d641f61e3');
INSERT INTO inventory_alert (id, alert_level, quantity_at_risk, estimated_loss, expiry_days_left, ai_recommendation, recommended_action, confidence_score, status, created_at, branch_id, product_id, stock_item_id) VALUES ('9db490bd-62bc-4f14-9e87-97d91b93f20f', 'high', 100, '100.00', 5, 'Monitor closely', 'DISCOUNT', 85, 'active', '2026-05-14 00:09:13.418322-07:00', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', 'd4e0bb21-b148-42f9-a4f3-ba2f4cf7a217', 'b8132c60-446c-44e4-bf57-e716a120d7b0');
INSERT INTO inventory_alert (id, alert_level, quantity_at_risk, estimated_loss, expiry_days_left, ai_recommendation, recommended_action, confidence_score, status, created_at, branch_id, product_id, stock_item_id) VALUES ('132c13cb-35d1-4577-955e-3fb50cf6855b', 'high', 100, '80.00', 5, 'Monitor closely', 'DISCOUNT', 85, 'active', '2026-05-14 00:09:13.766181-07:00', 'cbcf7248-8552-458d-b6c9-8aa031c81747', 'e0e8aa82-4c27-4ce1-b2d6-f0bd199d5b07', '625e37ba-61fd-4870-917c-141d076c60b1');
INSERT INTO inventory_alert (id, alert_level, quantity_at_risk, estimated_loss, expiry_days_left, ai_recommendation, recommended_action, confidence_score, status, created_at, branch_id, product_id, stock_item_id) VALUES ('4323c68d-261d-4eb2-a5b3-d9930282502e', 'high', 100, '150.00', 5, 'Monitor closely', 'DISCOUNT', 85, 'active', '2026-05-14 00:09:14.030858-07:00', 'e70b410d-d4c3-48d0-a72d-0e7c22c9ab02', '0aab8559-7f49-4f91-b72b-a67d51013cd2', '42ce6308-5ed6-4422-9976-a8e89d41607e');
INSERT INTO inventory_alert (id, alert_level, quantity_at_risk, estimated_loss, expiry_days_left, ai_recommendation, recommended_action, confidence_score, status, created_at, branch_id, product_id, stock_item_id) VALUES ('e860fc60-0dd8-4ac1-9bd4-77a06b77b07e', 'high', 100, '100.00', 5, 'Monitor closely', 'DISCOUNT', 85, 'active', '2026-05-14 00:09:14.287311-07:00', 'e70b410d-d4c3-48d0-a72d-0e7c22c9ab02', 'd4e0bb21-b148-42f9-a4f3-ba2f4cf7a217', '9ccbddd9-4a2b-4512-a696-73fa6bbb7a74');
INSERT INTO inventory_alert (id, alert_level, quantity_at_risk, estimated_loss, expiry_days_left, ai_recommendation, recommended_action, confidence_score, status, created_at, branch_id, product_id, stock_item_id) VALUES ('494fa315-49be-4240-9d31-5bd4488cdfa3', 'high', 100, '150.00', 5, 'Monitor closely', 'DISCOUNT', 85, 'active', '2026-05-14 00:09:14.552570-07:00', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', '0aab8559-7f49-4f91-b72b-a67d51013cd2', '4477ecb3-e7ec-4b0d-bbed-3626823d2cf2');
INSERT INTO inventory_alert (id, alert_level, quantity_at_risk, estimated_loss, expiry_days_left, ai_recommendation, recommended_action, confidence_score, status, created_at, branch_id, product_id, stock_item_id) VALUES ('172470d0-a5ff-46e5-a952-7899a8ae49fb', 'high', 100, '100.00', 5, 'Monitor closely', 'DISCOUNT', 85, 'active', '2026-05-14 00:09:14.818468-07:00', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', 'd4e0bb21-b148-42f9-a4f3-ba2f4cf7a217', 'b5510881-ce9d-4aa4-9d11-f4b7f64a2ba8');
INSERT INTO inventory_alert (id, alert_level, quantity_at_risk, estimated_loss, expiry_days_left, ai_recommendation, recommended_action, confidence_score, status, created_at, branch_id, product_id, stock_item_id) VALUES ('e2816e0f-f3cb-472d-a510-e5a806f1213c', 'high', 100, '80.00', 5, 'Monitor closely', 'DISCOUNT', 85, 'active', '2026-05-14 00:09:15.452030-07:00', 'cbcf7248-8552-458d-b6c9-8aa031c81747', 'e0e8aa82-4c27-4ce1-b2d6-f0bd199d5b07', '98212f4a-a702-48f3-b641-bdb14d1956b9');
INSERT INTO inventory_alert (id, alert_level, quantity_at_risk, estimated_loss, expiry_days_left, ai_recommendation, recommended_action, confidence_score, status, created_at, branch_id, product_id, stock_item_id) VALUES ('75c7d213-b765-4e87-a3cb-4c9e799192cb', 'high', 100, '150.00', 5, 'Monitor closely', 'DISCOUNT', 85, 'active', '2026-05-14 00:09:15.740582-07:00', 'e70b410d-d4c3-48d0-a72d-0e7c22c9ab02', '0aab8559-7f49-4f91-b72b-a67d51013cd2', 'ef0033c3-f4e5-4f44-932d-2386b2b60bd9');
INSERT INTO inventory_alert (id, alert_level, quantity_at_risk, estimated_loss, expiry_days_left, ai_recommendation, recommended_action, confidence_score, status, created_at, branch_id, product_id, stock_item_id) VALUES ('91a5616b-3fc3-487d-a0a0-d05dd3aba260', 'high', 100, '100.00', 5, 'Monitor closely', 'DISCOUNT', 85, 'active', '2026-05-14 00:09:16.005423-07:00', 'e70b410d-d4c3-48d0-a72d-0e7c22c9ab02', 'd4e0bb21-b148-42f9-a4f3-ba2f4cf7a217', '24fad4d0-3aee-485a-ad43-9a9e3cda6670');
INSERT INTO inventory_alert (id, alert_level, quantity_at_risk, estimated_loss, expiry_days_left, ai_recommendation, recommended_action, confidence_score, status, created_at, branch_id, product_id, stock_item_id) VALUES ('9f967d7f-28b6-4397-8684-55a16cc03bf4', 'high', 100, '150.00', 5, 'Monitor closely', 'DISCOUNT', 85, 'active', '2026-05-14 00:13:01.274965-07:00', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', '0aab8559-7f49-4f91-b72b-a67d51013cd2', 'c16ad09e-8847-44d7-81ac-bdc37f29e2a4');
INSERT INTO inventory_alert (id, alert_level, quantity_at_risk, estimated_loss, expiry_days_left, ai_recommendation, recommended_action, confidence_score, status, created_at, branch_id, product_id, stock_item_id) VALUES ('31250b05-2839-42b9-9039-2ed9c0cb99da', 'high', 100, '100.00', 5, 'Monitor closely', 'DISCOUNT', 85, 'active', '2026-05-14 00:13:01.550539-07:00', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', 'd4e0bb21-b148-42f9-a4f3-ba2f4cf7a217', 'b6f03870-517d-4ada-86c2-bc6d0e67fd90');
INSERT INTO inventory_alert (id, alert_level, quantity_at_risk, estimated_loss, expiry_days_left, ai_recommendation, recommended_action, confidence_score, status, created_at, branch_id, product_id, stock_item_id) VALUES ('4acf44a8-7076-430b-8dfe-9a9837b77523', 'high', 100, '80.00', 5, 'Monitor closely', 'DISCOUNT', 85, 'active', '2026-05-14 00:13:01.810176-07:00', 'cbcf7248-8552-458d-b6c9-8aa031c81747', 'e0e8aa82-4c27-4ce1-b2d6-f0bd199d5b07', '552fb744-d3d1-4f5a-8641-856f63fa58ce');
INSERT INTO inventory_alert (id, alert_level, quantity_at_risk, estimated_loss, expiry_days_left, ai_recommendation, recommended_action, confidence_score, status, created_at, branch_id, product_id, stock_item_id) VALUES ('9a629727-f839-4c6f-ae82-e6bdc82a63c3', 'high', 100, '150.00', 5, 'Monitor closely', 'DISCOUNT', 85, 'active', '2026-05-14 00:13:02.265862-07:00', 'e70b410d-d4c3-48d0-a72d-0e7c22c9ab02', '0aab8559-7f49-4f91-b72b-a67d51013cd2', 'bebac96b-6b3a-4fcf-9bb0-8985d0401021');
INSERT INTO inventory_alert (id, alert_level, quantity_at_risk, estimated_loss, expiry_days_left, ai_recommendation, recommended_action, confidence_score, status, created_at, branch_id, product_id, stock_item_id) VALUES ('00bc133d-674f-47c9-a217-09b481a5aa1a', 'high', 100, '100.00', 5, 'Monitor closely', 'DISCOUNT', 85, 'active', '2026-05-14 00:13:02.520918-07:00', 'e70b410d-d4c3-48d0-a72d-0e7c22c9ab02', 'd4e0bb21-b148-42f9-a4f3-ba2f4cf7a217', 'f765c8fe-7f10-430d-a520-544d9c94fa44');
INSERT INTO inventory_alert (id, alert_level, quantity_at_risk, estimated_loss, expiry_days_left, ai_recommendation, recommended_action, confidence_score, status, created_at, branch_id, product_id, stock_item_id) VALUES ('dbd2f434-76d3-49bb-bbc3-647388ae38e8', 'high', 58, '116.00', 3, 'System recommends immediate action for Sunflower Oil at Khatai Center. High risk of spoilage.', 'DISCOUNT', 94, 'active', '2026-05-14 04:03:03.175019-07:00', '336c28f2-4d43-4b4f-a659-bb157c5ca432', 'f41b6cfd-57e0-4067-8cfe-d0e13dff8419', 'f283ce53-040c-4f6f-ad6f-bc1670d0f244');
INSERT INTO inventory_alert (id, alert_level, quantity_at_risk, estimated_loss, expiry_days_left, ai_recommendation, recommended_action, confidence_score, status, created_at, branch_id, product_id, stock_item_id) VALUES ('1f58e775-63e1-42b8-bedd-48f806245589', 'medium', 75, '450.00', 7, 'System recommends immediate action for Feta Cheese at Yasamal. High risk of spoilage.', 'DISCOUNT', 90, 'active', '2026-05-14 04:03:03.177011-07:00', '0130b83e-5e0a-4ed6-bc12-4fdc08f46c27', '5cafb430-4149-4940-917a-698ac15d2e48', '9742d9bc-5435-4f89-ad94-f50ff4eb4e2b');
INSERT INTO inventory_alert (id, alert_level, quantity_at_risk, estimated_loss, expiry_days_left, ai_recommendation, recommended_action, confidence_score, status, created_at, branch_id, product_id, stock_item_id) VALUES ('03ea8792-185c-43de-8a01-185f4573f47d', 'critical', 67, '167.50', 1, 'System recommends immediate action for Basmati Rice at Yasamal. High risk of spoilage.', 'DONATE', 89, 'active', '2026-05-14 04:03:03.180071-07:00', '0130b83e-5e0a-4ed6-bc12-4fdc08f46c27', '10ba8eab-20a1-4615-8b68-14b516bbfd66', '308c7724-9929-4903-bb37-929b22be4e99');
INSERT INTO inventory_alert (id, alert_level, quantity_at_risk, estimated_loss, expiry_days_left, ai_recommendation, recommended_action, confidence_score, status, created_at, branch_id, product_id, stock_item_id) VALUES ('c5452360-cf5c-42ae-842c-7c129b39b302', 'high', 97, '242.50', 4, 'System recommends immediate action for Fresh Pomegranate at Yasamal. High risk of spoilage.', 'DISCOUNT', 86, 'active', '2026-05-14 04:03:03.182760-07:00', '0130b83e-5e0a-4ed6-bc12-4fdc08f46c27', 'abc19a1a-c9ac-400d-a079-5e9bca00b29b', 'f1ae2f30-d234-486f-b09b-deef8d6b36aa');
INSERT INTO inventory_alert (id, alert_level, quantity_at_risk, estimated_loss, expiry_days_left, ai_recommendation, recommended_action, confidence_score, status, created_at, branch_id, product_id, stock_item_id) VALUES ('af5c6003-9d0e-4b18-919c-3efb41ea61b8', 'high', 61, '274.50', 4, 'System recommends immediate action for Chicken Thighs at Narimanov. High risk of spoilage.', 'DISCOUNT', 87, 'active', '2026-05-14 04:03:03.184926-07:00', '04c4dbd7-3d17-46bb-814d-e7d3111577ac', 'aee4d56b-2e54-47ba-8af2-2e4a5bba868e', 'dfc1f731-c1c0-437c-aad8-769905521038');
INSERT INTO inventory_alert (id, alert_level, quantity_at_risk, estimated_loss, expiry_days_left, ai_recommendation, recommended_action, confidence_score, status, created_at, branch_id, product_id, stock_item_id) VALUES ('6009d476-1262-48ba-b8db-f7963b6f354c', 'high', 99, '247.50', 3, 'System recommends immediate action for Fresh Pomegranate at Baku Airport. High risk of spoilage.', 'DISCOUNT', 98, 'active', '2026-05-14 04:03:03.186879-07:00', 'ea9e7c28-6f35-4346-b25f-5ddb094f095a', 'abc19a1a-c9ac-400d-a079-5e9bca00b29b', 'd055a791-0336-4b51-9888-3828975f01d6');
INSERT INTO inventory_alert (id, alert_level, quantity_at_risk, estimated_loss, expiry_days_left, ai_recommendation, recommended_action, confidence_score, status, created_at, branch_id, product_id, stock_item_id) VALUES ('5214654c-6597-43d5-b000-9e75a83c08bd', 'high', 63, '504.00', 3, 'System recommends immediate action for Baklava at Khirdalan. High risk of spoilage.', 'DISCOUNT', 86, 'active', '2026-05-14 04:03:03.188555-07:00', '3ea7fb17-2bed-45bb-9162-8946414dcf8d', 'b4190d73-d742-415c-a258-d5c735f58800', '6e60e85a-c5ee-4659-a971-0dfddd49e392');
INSERT INTO inventory_alert (id, alert_level, quantity_at_risk, estimated_loss, expiry_days_left, ai_recommendation, recommended_action, confidence_score, status, created_at, branch_id, product_id, stock_item_id) VALUES ('787e132b-6273-4b48-881b-803356622257', 'high', 84, '252.00', 4, 'System recommends immediate action for Black Tea at Khirdalan. High risk of spoilage.', 'DISCOUNT', 90, 'active', '2026-05-14 04:03:03.190030-07:00', '3ea7fb17-2bed-45bb-9162-8946414dcf8d', '064e1324-ab2c-454e-bfbc-385cc4a5c831', '62b1a2df-e5c3-46c9-962c-b959c2c3f7d2');
INSERT INTO inventory_alert (id, alert_level, quantity_at_risk, estimated_loss, expiry_days_left, ai_recommendation, recommended_action, confidence_score, status, created_at, branch_id, product_id, stock_item_id) VALUES ('77ea1eb3-4b03-4529-a7e1-ef7529382d93', 'critical', 67, '147.40', 1, 'System recommends immediate action for Probiotic Yogurt at Khirdalan. High risk of spoilage.', 'DONATE', 97, 'active', '2026-05-14 04:03:03.191462-07:00', '3ea7fb17-2bed-45bb-9162-8946414dcf8d', 'b8324031-f1a5-47ef-b907-5346171c36a9', '9631e89d-1cc1-46ea-9dde-a6783c0b864b');
```

### Data for inventory_branch
```sql
INSERT INTO inventory_branch (id, branch_code, name, name_az, city, city_az, address, address_az, phone, email, opening_time, closing_time, timezone, status, risk_score, fefo_compliance_score, created_at, updated_at) VALUES ('4c58b56a-7293-49e2-b86b-bd7dfea16fe7', 'HQ-001', 'HQ', NULL, 'Baku', NULL, 'Nizami 1', NULL, '', NULL, '09:00:00', '21:00:00', 'Asia/Baku', 'active', '0.00', '0.00', '2026-05-13 22:39:36.295942-07:00', '2026-05-13 22:39:36.295967-07:00');
INSERT INTO inventory_branch (id, branch_code, name, name_az, city, city_az, address, address_az, phone, email, opening_time, closing_time, timezone, status, risk_score, fefo_compliance_score, created_at, updated_at) VALUES ('cbcf7248-8552-458d-b6c9-8aa031c81747', 'DT-002', 'Downtown Store', NULL, 'Baku', NULL, 'Fountains Square', NULL, '', NULL, '09:00:00', '21:00:00', 'Asia/Baku', 'active', '0.00', '0.00', '2026-05-13 22:39:36.304063-07:00', '2026-05-13 22:39:36.304071-07:00');
INSERT INTO inventory_branch (id, branch_code, name, name_az, city, city_az, address, address_az, phone, email, opening_time, closing_time, timezone, status, risk_score, fefo_compliance_score, created_at, updated_at) VALUES ('e70b410d-d4c3-48d0-a72d-0e7c22c9ab02', 'WC-003', 'White City Branch', NULL, 'Baku', NULL, 'White City', NULL, '', NULL, '09:00:00', '21:00:00', 'Asia/Baku', 'active', '0.00', '0.00', '2026-05-13 22:39:36.305827-07:00', '2026-05-13 22:39:36.305834-07:00');
INSERT INTO inventory_branch (id, branch_code, name, name_az, city, city_az, address, address_az, phone, email, opening_time, closing_time, timezone, status, risk_score, fefo_compliance_score, created_at, updated_at) VALUES ('336c28f2-4d43-4b4f-a659-bb157c5ca432', 'B011', 'Khatai Center', 'Xətai Mərkəzi', 'Baku', 'Bakı', 'Khatai district, 15', 'Xətai rayonu, 15', '+994 12 555 0110', 'khatai@bravoos.az', '09:00:00', '21:00:00', 'Asia/Baku', 'active', '0.00', '0.00', '2026-05-14 04:00:55.861669-07:00', '2026-05-14 04:00:55.861687-07:00');
INSERT INTO inventory_branch (id, branch_code, name, name_az, city, city_az, address, address_az, phone, email, opening_time, closing_time, timezone, status, risk_score, fefo_compliance_score, created_at, updated_at) VALUES ('0130b83e-5e0a-4ed6-bc12-4fdc08f46c27', 'B012', 'Yasamal', 'Yasamal', 'Baku', 'Bakı', 'Yasamal district, 42', 'Yasamal rayonu, 42', '+994 12 555 0111', 'yasamal@bravoos.az', '09:00:00', '21:00:00', 'Asia/Baku', 'active', '0.00', '0.00', '2026-05-14 04:00:55.870555-07:00', '2026-05-14 04:00:55.870565-07:00');
INSERT INTO inventory_branch (id, branch_code, name, name_az, city, city_az, address, address_az, phone, email, opening_time, closing_time, timezone, status, risk_score, fefo_compliance_score, created_at, updated_at) VALUES ('04c4dbd7-3d17-46bb-814d-e7d3111577ac', 'B013', 'Narimanov', 'Nərimanov', 'Baku', 'Bakı', 'Narimanov district, 8', 'Nərimanov rayonu, 8', '+994 12 555 0112', 'narimanov@bravoos.az', '09:00:00', '21:00:00', 'Asia/Baku', 'active', '0.00', '0.00', '2026-05-14 04:00:55.872378-07:00', '2026-05-14 04:00:55.872385-07:00');
INSERT INTO inventory_branch (id, branch_code, name, name_az, city, city_az, address, address_az, phone, email, opening_time, closing_time, timezone, status, risk_score, fefo_compliance_score, created_at, updated_at) VALUES ('ea9e7c28-6f35-4346-b25f-5ddb094f095a', 'B014', 'Baku Airport', 'Bakı Hava Limanı', 'Baku', 'Bakı', 'Heydar Aliyev International Airport', 'Heydər Əliyev Beynəlxalq Hava Limanı', '+994 12 555 0113', 'airport@bravoos.az', '09:00:00', '21:00:00', 'Asia/Baku', 'active', '0.00', '0.00', '2026-05-14 04:00:55.873965-07:00', '2026-05-14 04:00:55.873972-07:00');
INSERT INTO inventory_branch (id, branch_code, name, name_az, city, city_az, address, address_az, phone, email, opening_time, closing_time, timezone, status, risk_score, fefo_compliance_score, created_at, updated_at) VALUES ('3ea7fb17-2bed-45bb-9162-8946414dcf8d', 'B015', 'Khirdalan', 'Xırdalan', 'Khirdalan', 'Xırdalan', 'Central Street, 23', 'Mərkəzi küçə, 23', '+994 18 555 0114', 'khirdalan@bravoos.az', '09:00:00', '21:00:00', 'Asia/Baku', 'active', '0.00', '0.00', '2026-05-14 04:00:55.875428-07:00', '2026-05-14 04:00:55.875436-07:00');
INSERT INTO inventory_branch (id, branch_code, name, name_az, city, city_az, address, address_az, phone, email, opening_time, closing_time, timezone, status, risk_score, fefo_compliance_score, created_at, updated_at) VALUES ('b985ecff-d515-4015-8c9d-37fd943bdad0', 'B016', 'Shamakhi', 'Şamaxı', 'Shamakhi', 'Şamaxı', 'Heydar Aliyev Ave, 45', 'Heydər Əliyev prospekti, 45', '+994 20 555 0115', 'shamakhi@bravoos.az', '09:00:00', '21:00:00', 'Asia/Baku', 'active', '0.00', '0.00', '2026-05-14 04:00:55.876880-07:00', '2026-05-14 04:00:55.876887-07:00');
INSERT INTO inventory_branch (id, branch_code, name, name_az, city, city_az, address, address_az, phone, email, opening_time, closing_time, timezone, status, risk_score, fefo_compliance_score, created_at, updated_at) VALUES ('f9d9f08c-1bc3-43aa-ad69-abe7fc82907b', 'B017', 'Quba', 'Quba', 'Quba', 'Quba', 'Khinaliq Road, 12', 'Xınalıq yolu, 12', '+994 23 555 0116', 'quba@bravoos.az', '09:00:00', '21:00:00', 'Asia/Baku', 'active', '0.00', '0.00', '2026-05-14 04:00:55.878276-07:00', '2026-05-14 04:00:55.878283-07:00');
INSERT INTO inventory_branch (id, branch_code, name, name_az, city, city_az, address, address_az, phone, email, opening_time, closing_time, timezone, status, risk_score, fefo_compliance_score, created_at, updated_at) VALUES ('fbd1d143-2320-4015-bf79-83f4432dc03f', 'B018', 'Sabirabad', 'Sabirabad', 'Sabirabad', 'Sabirabad', 'Central Bazaar, 34', 'Mərkəzi Bazar, 34', '+994 21 555 0117', 'sabirabad@bravoos.az', '09:00:00', '21:00:00', 'Asia/Baku', 'active', '0.00', '0.00', '2026-05-14 04:00:55.880217-07:00', '2026-05-14 04:00:55.880225-07:00');
INSERT INTO inventory_branch (id, branch_code, name, name_az, city, city_az, address, address_az, phone, email, opening_time, closing_time, timezone, status, risk_score, fefo_compliance_score, created_at, updated_at) VALUES ('659a90cb-78cf-45a2-ac35-c7e37a6baa4b', 'B019', 'Agdas', 'Ağdaş', 'Agdas', 'Ağdaş', 'Nizami Street, 56', 'Nizami küçəsi, 56', '+994 21 555 0118', 'agdas@bravoos.az', '09:00:00', '21:00:00', 'Asia/Baku', 'active', '0.00', '0.00', '2026-05-14 04:00:55.882343-07:00', '2026-05-14 04:00:55.882351-07:00');
INSERT INTO inventory_branch (id, branch_code, name, name_az, city, city_az, address, address_az, phone, email, opening_time, closing_time, timezone, status, risk_score, fefo_compliance_score, created_at, updated_at) VALUES ('fd3e0e23-b34e-4b29-9e50-94221ee3f7c6', 'B020', 'Beylagan', 'Beyləqan', 'Beylagan', 'Beyləqan', 'Victory Ave, 78', 'Zəfər prospekti, 78', '+994 21 555 0119', 'beylagan@bravoos.az', '09:00:00', '21:00:00', 'Asia/Baku', 'active', '0.00', '0.00', '2026-05-14 04:00:55.887166-07:00', '2026-05-14 04:00:55.887190-07:00');
```

### Data for inventory_category
```sql
INSERT INTO inventory_category (id, name, name_az, description, is_active, created_at, parent_category_id) VALUES ('c0a06ba0-df2f-4050-880d-1b36c7ffbf73', 'Dairy', NULL, NULL, True, '2026-05-13 22:39:36.311831-07:00', NULL);
INSERT INTO inventory_category (id, name, name_az, description, is_active, created_at, parent_category_id) VALUES ('ad2d7a95-6ada-4f16-92a0-76d037efd6a8', 'Produce', NULL, NULL, True, '2026-05-13 22:39:36.315272-07:00', NULL);
INSERT INTO inventory_category (id, name, name_az, description, is_active, created_at, parent_category_id) VALUES ('92e2db92-0925-46c9-9e70-40386d13d1b5', 'Bakery', NULL, NULL, True, '2026-05-13 22:39:36.317639-07:00', NULL);
INSERT INTO inventory_category (id, name, name_az, description, is_active, created_at, parent_category_id) VALUES ('172b1ebc-c238-48d9-ba76-509a65f740d1', 'Meat', NULL, NULL, True, '2026-05-13 22:39:36.319308-07:00', NULL);
INSERT INTO inventory_category (id, name, name_az, description, is_active, created_at, parent_category_id) VALUES ('a08b57d2-fae0-44d6-a318-64d21ab9b931', 'Beverages', NULL, NULL, True, '2026-05-13 22:39:36.320713-07:00', NULL);
INSERT INTO inventory_category (id, name, name_az, description, is_active, created_at, parent_category_id) VALUES ('0c060369-f23f-4950-a631-2b77c15c1f96', 'Frozen', 'Dondurulmuş', 'Frozen vegetables, meat, ice cream', True, '2026-05-14 04:00:55.895304-07:00', NULL);
INSERT INTO inventory_category (id, name, name_az, description, is_active, created_at, parent_category_id) VALUES ('0d7eef37-b70f-4b63-9b22-cf82a467bba8', 'Grocery', 'Ərzaq', 'Dry goods, canned foods, rice, pasta', True, '2026-05-14 04:00:55.898786-07:00', NULL);
```

### Data for inventory_product
```sql
INSERT INTO inventory_product (id, sku, barcode, name, name_az, description, unit, unit_az, cost_price, selling_price, min_stock_level, max_stock_level, reorder_point, lead_time_days, storage_requirements, is_perishable, shelf_life_days, is_active, image_url, created_at, updated_at, category_id) VALUES ('facdb5a4-b5d2-4dfc-b664-ff25d69cdd8e', 'MILK-001', NULL, '2% Milk', NULL, NULL, 'liters', NULL, '1.75', '2.50', 0, 0, 0, 1, '{}', True, NULL, True, NULL, '2026-05-13 22:39:36.329935-07:00', '2026-05-13 22:39:36.329947-07:00', 'c0a06ba0-df2f-4050-880d-1b36c7ffbf73');
INSERT INTO inventory_product (id, sku, barcode, name, name_az, description, unit, unit_az, cost_price, selling_price, min_stock_level, max_stock_level, reorder_point, lead_time_days, storage_requirements, is_perishable, shelf_life_days, is_active, image_url, created_at, updated_at, category_id) VALUES ('8e4f6089-c842-413f-9bed-724197c8324f', 'MILK-002', NULL, 'Whole Milk', NULL, NULL, 'liters', NULL, '1.96', '2.80', 0, 0, 0, 1, '{}', True, NULL, True, NULL, '2026-05-13 22:39:36.338927-07:00', '2026-05-13 22:39:36.338937-07:00', 'c0a06ba0-df2f-4050-880d-1b36c7ffbf73');
INSERT INTO inventory_product (id, sku, barcode, name, name_az, description, unit, unit_az, cost_price, selling_price, min_stock_level, max_stock_level, reorder_point, lead_time_days, storage_requirements, is_perishable, shelf_life_days, is_active, image_url, created_at, updated_at, category_id) VALUES ('733dfae3-1a97-4e81-b15a-eab56d9654fd', 'YOG-001', NULL, 'Greek Yogurt', NULL, NULL, 'units', NULL, '2.24', '3.20', 0, 0, 0, 1, '{}', True, NULL, True, NULL, '2026-05-13 22:39:36.342085-07:00', '2026-05-13 22:39:36.342101-07:00', 'c0a06ba0-df2f-4050-880d-1b36c7ffbf73');
INSERT INTO inventory_product (id, sku, barcode, name, name_az, description, unit, unit_az, cost_price, selling_price, min_stock_level, max_stock_level, reorder_point, lead_time_days, storage_requirements, is_perishable, shelf_life_days, is_active, image_url, created_at, updated_at, category_id) VALUES ('08b12a39-cc8e-4057-9eae-a23c0390ee92', 'PROD-001', NULL, 'Tomatoes', NULL, NULL, 'kg', NULL, '1.05', '1.50', 0, 0, 0, 1, '{}', True, NULL, True, NULL, '2026-05-13 22:39:36.345364-07:00', '2026-05-13 22:39:36.345373-07:00', 'ad2d7a95-6ada-4f16-92a0-76d037efd6a8');
INSERT INTO inventory_product (id, sku, barcode, name, name_az, description, unit, unit_az, cost_price, selling_price, min_stock_level, max_stock_level, reorder_point, lead_time_days, storage_requirements, is_perishable, shelf_life_days, is_active, image_url, created_at, updated_at, category_id) VALUES ('ad5544f3-ece8-4858-ad83-99afbbdaaa9d', 'BAKE-001', NULL, 'Sourdough Bread', NULL, NULL, 'units', NULL, '2.80', '4.00', 0, 0, 0, 1, '{}', True, NULL, True, NULL, '2026-05-13 22:39:36.347902-07:00', '2026-05-13 22:39:36.347912-07:00', '92e2db92-0925-46c9-9e70-40386d13d1b5');
INSERT INTO inventory_product (id, sku, barcode, name, name_az, description, unit, unit_az, cost_price, selling_price, min_stock_level, max_stock_level, reorder_point, lead_time_days, storage_requirements, is_perishable, shelf_life_days, is_active, image_url, created_at, updated_at, category_id) VALUES ('0aab8559-7f49-4f91-b72b-a67d51013cd2', 'SKU-001', NULL, '2% Milk', NULL, NULL, 'Unit', NULL, '1.50', '2.50', 0, 0, 0, 1, '{}', True, NULL, True, NULL, '2026-05-13 23:37:04.492559-07:00', '2026-05-13 23:37:04.492580-07:00', 'c0a06ba0-df2f-4050-880d-1b36c7ffbf73');
INSERT INTO inventory_product (id, sku, barcode, name, name_az, description, unit, unit_az, cost_price, selling_price, min_stock_level, max_stock_level, reorder_point, lead_time_days, storage_requirements, is_perishable, shelf_life_days, is_active, image_url, created_at, updated_at, category_id) VALUES ('e0e8aa82-4c27-4ce1-b2d6-f0bd199d5b07', 'SKU-002', NULL, 'Sourdough Bread', NULL, NULL, 'Unit', NULL, '0.80', '1.50', 0, 0, 0, 1, '{}', True, NULL, True, NULL, '2026-05-13 23:37:04.502890-07:00', '2026-05-13 23:37:04.502902-07:00', '92e2db92-0925-46c9-9e70-40386d13d1b5');
INSERT INTO inventory_product (id, sku, barcode, name, name_az, description, unit, unit_az, cost_price, selling_price, min_stock_level, max_stock_level, reorder_point, lead_time_days, storage_requirements, is_perishable, shelf_life_days, is_active, image_url, created_at, updated_at, category_id) VALUES ('d4e0bb21-b148-42f9-a4f3-ba2f4cf7a217', 'SKU-003', NULL, 'Lettuce', NULL, NULL, 'Kg', NULL, '1.00', '2.00', 0, 0, 0, 1, '{}', True, NULL, True, NULL, '2026-05-13 23:37:04.507266-07:00', '2026-05-13 23:37:04.507279-07:00', 'ad2d7a95-6ada-4f16-92a0-76d037efd6a8');
INSERT INTO inventory_product (id, sku, barcode, name, name_az, description, unit, unit_az, cost_price, selling_price, min_stock_level, max_stock_level, reorder_point, lead_time_days, storage_requirements, is_perishable, shelf_life_days, is_active, image_url, created_at, updated_at, category_id) VALUES ('8b8202df-721d-4b3d-8963-0eed4ca6f409', 'MILK-003', '5001234567915', 'Lactose-Free Milk', 'Laktozasız Süd', NULL, 'liter', 'litr', '3.00', '4.99', 0, 0, 0, 1, '{}', True, 14, True, NULL, '2026-05-14 04:00:55.910316-07:00', '2026-05-14 04:00:55.910336-07:00', 'c0a06ba0-df2f-4050-880d-1b36c7ffbf73');
INSERT INTO inventory_product (id, sku, barcode, name, name_az, description, unit, unit_az, cost_price, selling_price, min_stock_level, max_stock_level, reorder_point, lead_time_days, storage_requirements, is_perishable, shelf_life_days, is_active, image_url, created_at, updated_at, category_id) VALUES ('b8324031-f1a5-47ef-b907-5346171c36a9', 'YOGURT-002', '5001234567916', 'Probiotic Yogurt', 'Probiotik Yoqurt', NULL, 'pack', 'paket', '2.20', '3.49', 0, 0, 0, 1, '{}', True, 21, True, NULL, '2026-05-14 04:00:55.920802-07:00', '2026-05-14 04:00:55.920825-07:00', 'c0a06ba0-df2f-4050-880d-1b36c7ffbf73');
INSERT INTO inventory_product (id, sku, barcode, name, name_az, description, unit, unit_az, cost_price, selling_price, min_stock_level, max_stock_level, reorder_point, lead_time_days, storage_requirements, is_perishable, shelf_life_days, is_active, image_url, created_at, updated_at, category_id) VALUES ('5cafb430-4149-4940-917a-698ac15d2e48', 'CHEESE-003', '5001234567918', 'Feta Cheese', 'Feta Pendiri', NULL, 'kg', 'kq', '6.00', '11.99', 0, 0, 0, 1, '{}', True, 45, True, NULL, '2026-05-14 04:00:55.925825-07:00', '2026-05-14 04:00:55.925843-07:00', 'c0a06ba0-df2f-4050-880d-1b36c7ffbf73');
INSERT INTO inventory_product (id, sku, barcode, name, name_az, description, unit, unit_az, cost_price, selling_price, min_stock_level, max_stock_level, reorder_point, lead_time_days, storage_requirements, is_perishable, shelf_life_days, is_active, image_url, created_at, updated_at, category_id) VALUES ('abc19a1a-c9ac-400d-a079-5e9bca00b29b', 'POMEGRANATE-001', '5001234567921', 'Fresh Pomegranate', 'Təzə Nar', NULL, 'kg', 'kq', '2.50', '4.99', 0, 0, 0, 1, '{}', True, 30, True, NULL, '2026-05-14 04:00:55.930540-07:00', '2026-05-14 04:00:55.930559-07:00', 'ad2d7a95-6ada-4f16-92a0-76d037efd6a8');
INSERT INTO inventory_product (id, sku, barcode, name, name_az, description, unit, unit_az, cost_price, selling_price, min_stock_level, max_stock_level, reorder_point, lead_time_days, storage_requirements, is_perishable, shelf_life_days, is_active, image_url, created_at, updated_at, category_id) VALUES ('c8427e43-a39b-4bf5-87b0-fdbd816fc814', 'PERSIMMON-001', '5001234567922', 'Persimmon', 'Xurma', NULL, 'kg', 'kq', '2.00', '3.99', 0, 0, 0, 1, '{}', True, 14, True, NULL, '2026-05-14 04:00:55.934833-07:00', '2026-05-14 04:00:55.934852-07:00', 'ad2d7a95-6ada-4f16-92a0-76d037efd6a8');
INSERT INTO inventory_product (id, sku, barcode, name, name_az, description, unit, unit_az, cost_price, selling_price, min_stock_level, max_stock_level, reorder_point, lead_time_days, storage_requirements, is_perishable, shelf_life_days, is_active, image_url, created_at, updated_at, category_id) VALUES ('881ac5f1-f7f9-4bde-a73c-772c2e9f4aa5', 'BREAD-004', '5001234567931', 'Whole Wheat Bread', 'Tam Taxıllı Çörək', NULL, 'unit', 'ədəd', '0.90', '1.79', 0, 0, 0, 1, '{}', True, 3, True, NULL, '2026-05-14 04:00:55.940117-07:00', '2026-05-14 04:00:55.940134-07:00', '92e2db92-0925-46c9-9e70-40386d13d1b5');
INSERT INTO inventory_product (id, sku, barcode, name, name_az, description, unit, unit_az, cost_price, selling_price, min_stock_level, max_stock_level, reorder_point, lead_time_days, storage_requirements, is_perishable, shelf_life_days, is_active, image_url, created_at, updated_at, category_id) VALUES ('b4190d73-d742-415c-a258-d5c735f58800', 'PASTRY-001', '5001234567934', 'Baklava', 'Paxlava', NULL, 'kg', 'kq', '8.00', '14.99', 0, 0, 0, 1, '{}', True, 7, True, NULL, '2026-05-14 04:00:55.944156-07:00', '2026-05-14 04:00:55.944171-07:00', '92e2db92-0925-46c9-9e70-40386d13d1b5');
INSERT INTO inventory_product (id, sku, barcode, name, name_az, description, unit, unit_az, cost_price, selling_price, min_stock_level, max_stock_level, reorder_point, lead_time_days, storage_requirements, is_perishable, shelf_life_days, is_active, image_url, created_at, updated_at, category_id) VALUES ('aee4d56b-2e54-47ba-8af2-2e4a5bba868e', 'CHICKEN-002', '5001234567939', 'Chicken Thighs', 'Toyuq Butu', NULL, 'kg', 'kq', '4.50', '7.99', 0, 0, 0, 1, '{}', True, 3, True, NULL, '2026-05-14 04:00:55.946663-07:00', '2026-05-14 04:00:55.946673-07:00', '172b1ebc-c238-48d9-ba76-509a65f740d1');
INSERT INTO inventory_product (id, sku, barcode, name, name_az, description, unit, unit_az, cost_price, selling_price, min_stock_level, max_stock_level, reorder_point, lead_time_days, storage_requirements, is_perishable, shelf_life_days, is_active, image_url, created_at, updated_at, category_id) VALUES ('e278bab5-191b-4cff-9e6d-03662a1de45b', 'WATER-002', '5001234567945', 'Sparkling Water', 'Qazlı Su', NULL, 'liter', 'litr', '0.40', '1.19', 0, 0, 0, 1, '{}', False, 365, True, NULL, '2026-05-14 04:00:55.951175-07:00', '2026-05-14 04:00:55.951195-07:00', 'a08b57d2-fae0-44d6-a318-64d21ab9b931');
INSERT INTO inventory_product (id, sku, barcode, name, name_az, description, unit, unit_az, cost_price, selling_price, min_stock_level, max_stock_level, reorder_point, lead_time_days, storage_requirements, is_perishable, shelf_life_days, is_active, image_url, created_at, updated_at, category_id) VALUES ('064e1324-ab2c-454e-bfbc-385cc4a5c831', 'TEA-001', '5001234567950', 'Black Tea', 'Qara Çay', NULL, 'pack', 'paket', '3.00', '5.99', 0, 0, 0, 1, '{}', False, 365, True, NULL, '2026-05-14 04:00:55.956366-07:00', '2026-05-14 04:00:55.956382-07:00', 'a08b57d2-fae0-44d6-a318-64d21ab9b931');
INSERT INTO inventory_product (id, sku, barcode, name, name_az, description, unit, unit_az, cost_price, selling_price, min_stock_level, max_stock_level, reorder_point, lead_time_days, storage_requirements, is_perishable, shelf_life_days, is_active, image_url, created_at, updated_at, category_id) VALUES ('d46357bb-48aa-49a3-a1a4-e855e309d1b4', 'FROZEN-VEG-001', '5001234567953', 'Frozen Mixed Vegetables', 'Dondurulmuş Qarışıq Tərəvəz', NULL, 'kg', 'kq', '2.00', '3.99', 0, 0, 0, 1, '{}', False, 180, True, NULL, '2026-05-14 04:00:55.960093-07:00', '2026-05-14 04:00:55.960108-07:00', '0c060369-f23f-4950-a631-2b77c15c1f96');
INSERT INTO inventory_product (id, sku, barcode, name, name_az, description, unit, unit_az, cost_price, selling_price, min_stock_level, max_stock_level, reorder_point, lead_time_days, storage_requirements, is_perishable, shelf_life_days, is_active, image_url, created_at, updated_at, category_id) VALUES ('10ba8eab-20a1-4615-8b68-14b516bbfd66', 'RICE-001', '5001234567961', 'Basmati Rice', 'Basmati Düyü', NULL, 'kg', 'kq', '2.50', '4.99', 0, 0, 0, 1, '{}', False, 365, True, NULL, '2026-05-14 04:00:55.963723-07:00', '2026-05-14 04:00:55.963737-07:00', '0d7eef37-b70f-4b63-9b22-cf82a467bba8');
INSERT INTO inventory_product (id, sku, barcode, name, name_az, description, unit, unit_az, cost_price, selling_price, min_stock_level, max_stock_level, reorder_point, lead_time_days, storage_requirements, is_perishable, shelf_life_days, is_active, image_url, created_at, updated_at, category_id) VALUES ('f41b6cfd-57e0-4067-8cfe-d0e13dff8419', 'OIL-001', '5001234567967', 'Sunflower Oil', 'Günəbaxan Yağı', NULL, 'liter', 'litr', '2.00', '3.99', 0, 0, 0, 1, '{}', False, 365, True, NULL, '2026-05-14 04:00:55.970183-07:00', '2026-05-14 04:00:55.970210-07:00', '0d7eef37-b70f-4b63-9b22-cf82a467bba8');
```

### Data for inventory_stockitem
```sql
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('2b99b48e-41e4-4d95-a9ba-0e8a9c9c2a87', 'BATCH-5229', 55, 0, 0, '2026-07-05', '2026-05-14', 'Main Shelf', NULL, 'active', '2026-05-13 22:39:36.354045-07:00', '2026-05-13 22:39:36.354053-07:00', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', 'facdb5a4-b5d2-4dfc-b664-ff25d69cdd8e');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('11aeac0f-991a-41d0-8743-8a1f99549b4b', 'BATCH-9627', 26, 0, 0, '2026-05-28', '2026-05-14', 'Main Shelf', NULL, 'active', '2026-05-13 22:39:36.359056-07:00', '2026-05-13 22:39:36.359076-07:00', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', '8e4f6089-c842-413f-9bed-724197c8324f');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('fa015f84-0fd4-40d2-becf-d9721a5015b7', 'BATCH-1543', 36, 0, 0, '2026-07-11', '2026-05-14', 'Main Shelf', NULL, 'active', '2026-05-13 22:39:36.363789-07:00', '2026-05-13 22:39:36.363797-07:00', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', '733dfae3-1a97-4e81-b15a-eab56d9654fd');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('fbe34ead-09d6-4050-a994-cd6e41c6d5b8', 'BATCH-4280', 10, 0, 0, '2026-07-04', '2026-05-14', 'Main Shelf', NULL, 'active', '2026-05-13 22:39:36.366450-07:00', '2026-05-13 22:39:36.366457-07:00', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', '08b12a39-cc8e-4057-9eae-a23c0390ee92');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('6f9473ce-fe9a-465e-8436-5963adf66280', 'BATCH-6852', 73, 0, 0, '2026-05-17', '2026-05-14', 'Main Shelf', NULL, 'active', '2026-05-13 22:39:36.368489-07:00', '2026-05-13 22:39:36.368496-07:00', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', 'ad5544f3-ece8-4858-ad83-99afbbdaaa9d');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('be01aaf9-bd4b-402e-9a23-09f5b54d0d71', 'BATCH-8806', 36, 0, 0, '2026-06-17', '2026-05-14', 'Main Shelf', NULL, 'active', '2026-05-13 22:39:36.370630-07:00', '2026-05-13 22:39:36.370636-07:00', 'cbcf7248-8552-458d-b6c9-8aa031c81747', 'facdb5a4-b5d2-4dfc-b664-ff25d69cdd8e');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('9d7ddfce-0e1a-4992-b29d-cfcc937c719d', 'BATCH-8246', 52, 0, 0, '2026-06-28', '2026-05-14', 'Main Shelf', NULL, 'active', '2026-05-13 22:39:36.372596-07:00', '2026-05-13 22:39:36.372602-07:00', 'cbcf7248-8552-458d-b6c9-8aa031c81747', '8e4f6089-c842-413f-9bed-724197c8324f');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('8a5a7cd8-8ebd-4678-b526-dea0d189b976', 'BATCH-6904', 63, 0, 0, '2026-06-06', '2026-05-14', 'Main Shelf', NULL, 'active', '2026-05-13 22:39:36.377266-07:00', '2026-05-13 22:39:36.377296-07:00', 'cbcf7248-8552-458d-b6c9-8aa031c81747', '733dfae3-1a97-4e81-b15a-eab56d9654fd');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('e7c5b020-2b97-4f39-8a95-96aec6e26eb3', 'BATCH-2864', 41, 0, 0, '2026-06-28', '2026-05-14', 'Main Shelf', NULL, 'active', '2026-05-13 22:39:36.386161-07:00', '2026-05-13 22:39:36.386185-07:00', 'cbcf7248-8552-458d-b6c9-8aa031c81747', '08b12a39-cc8e-4057-9eae-a23c0390ee92');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('dff410e5-dea1-46e4-a57e-3e4246268a6e', 'BATCH-3031', 99, 0, 0, '2026-07-08', '2026-05-14', 'Main Shelf', NULL, 'active', '2026-05-13 22:39:36.395134-07:00', '2026-05-13 22:39:36.395160-07:00', 'cbcf7248-8552-458d-b6c9-8aa031c81747', 'ad5544f3-ece8-4858-ad83-99afbbdaaa9d');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('c6fcbd6c-e258-4cd5-8194-ccf4cfd6a415', 'BATCH-3629', 54, 0, 0, '2026-06-30', '2026-05-14', 'Main Shelf', NULL, 'active', '2026-05-13 22:39:36.403035-07:00', '2026-05-13 22:39:36.403055-07:00', 'e70b410d-d4c3-48d0-a72d-0e7c22c9ab02', 'facdb5a4-b5d2-4dfc-b664-ff25d69cdd8e');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('986c6e7d-72bc-479e-b12d-6bd87d601bbc', 'BATCH-1126', 29, 0, 0, '2026-06-06', '2026-05-14', 'Main Shelf', NULL, 'active', '2026-05-13 22:39:36.411710-07:00', '2026-05-13 22:39:36.411739-07:00', 'e70b410d-d4c3-48d0-a72d-0e7c22c9ab02', '8e4f6089-c842-413f-9bed-724197c8324f');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('d8d2a181-d726-499f-9934-9a1462841915', 'BATCH-9282', 67, 0, 0, '2026-06-24', '2026-05-14', 'Main Shelf', NULL, 'active', '2026-05-13 22:39:36.420000-07:00', '2026-05-13 22:39:36.420017-07:00', 'e70b410d-d4c3-48d0-a72d-0e7c22c9ab02', '733dfae3-1a97-4e81-b15a-eab56d9654fd');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('afd5c936-4d87-4ab8-879f-fbc00648947d', 'BATCH-9357', 42, 0, 0, '2026-07-03', '2026-05-14', 'Main Shelf', NULL, 'active', '2026-05-13 22:39:36.427981-07:00', '2026-05-13 22:39:36.428006-07:00', 'e70b410d-d4c3-48d0-a72d-0e7c22c9ab02', '08b12a39-cc8e-4057-9eae-a23c0390ee92');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('959015a2-8c6f-443d-aaae-2ab2cc3e296b', 'BATCH-3663', 47, 0, 0, '2026-05-17', '2026-05-14', 'Main Shelf', NULL, 'active', '2026-05-13 22:39:36.433831-07:00', '2026-05-13 22:39:36.433846-07:00', 'e70b410d-d4c3-48d0-a72d-0e7c22c9ab02', 'ad5544f3-ece8-4858-ad83-99afbbdaaa9d');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('46bef634-ba54-418d-9da8-f3ff8730ad13', 'BATCH-FA5D49', 100, 0, 0, '2026-06-13', '2026-05-14', NULL, NULL, 'active', '2026-05-13 23:37:04.514222-07:00', '2026-05-13 23:37:04.514231-07:00', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', '0aab8559-7f49-4f91-b72b-a67d51013cd2');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('5ec8fe0d-e1c1-49e1-8017-92d932c1195b', 'EXPIRED-BDFDEA', 10, 0, 0, '2026-05-09', '2026-05-14', NULL, NULL, 'Expired', '2026-05-13 23:37:04.516773-07:00', '2026-05-13 23:37:04.516780-07:00', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', '0aab8559-7f49-4f91-b72b-a67d51013cd2');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('3deff0ea-b6a0-4f9b-b8e2-73c8de976439', 'BATCH-D8984E', 100, 0, 0, '2026-06-13', '2026-05-14', NULL, NULL, 'active', '2026-05-13 23:37:04.519046-07:00', '2026-05-13 23:37:04.519054-07:00', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', 'e0e8aa82-4c27-4ce1-b2d6-f0bd199d5b07');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('2d7f5e3b-d7be-4579-85cc-f3087adc186b', 'EXPIRED-99F2AD', 10, 0, 0, '2026-05-09', '2026-05-14', NULL, NULL, 'Expired', '2026-05-13 23:37:04.520757-07:00', '2026-05-13 23:37:04.520765-07:00', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', 'e0e8aa82-4c27-4ce1-b2d6-f0bd199d5b07');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('cb0af9ed-c0eb-4ed2-b8e8-c9749af24d35', 'BATCH-087A6E', 100, 0, 0, '2026-06-13', '2026-05-14', NULL, NULL, 'active', '2026-05-13 23:37:04.523872-07:00', '2026-05-13 23:37:04.523880-07:00', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', 'd4e0bb21-b148-42f9-a4f3-ba2f4cf7a217');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('be434d36-90ee-4589-b251-e50b3f47a135', 'EXPIRED-54507D', 10, 0, 0, '2026-05-09', '2026-05-14', NULL, NULL, 'Expired', '2026-05-13 23:37:04.525422-07:00', '2026-05-13 23:37:04.525428-07:00', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', 'd4e0bb21-b148-42f9-a4f3-ba2f4cf7a217');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('1d870927-78a9-4f70-98b8-1af510570b89', 'BATCH-8BC422', 100, 0, 0, '2026-06-13', '2026-05-14', NULL, NULL, 'active', '2026-05-13 23:37:04.527640-07:00', '2026-05-13 23:37:04.527647-07:00', 'cbcf7248-8552-458d-b6c9-8aa031c81747', '0aab8559-7f49-4f91-b72b-a67d51013cd2');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('af5adb1b-fc09-4e37-952a-ceee029613fc', 'EXPIRED-04A1F8', 10, 0, 0, '2026-05-09', '2026-05-14', NULL, NULL, 'Expired', '2026-05-13 23:37:04.528821-07:00', '2026-05-13 23:37:04.528827-07:00', 'cbcf7248-8552-458d-b6c9-8aa031c81747', '0aab8559-7f49-4f91-b72b-a67d51013cd2');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('f8a32127-230f-4e1d-aeaf-41999e15a265', 'BATCH-FFF5C6', 100, 0, 0, '2026-06-13', '2026-05-14', NULL, NULL, 'active', '2026-05-13 23:37:04.531183-07:00', '2026-05-13 23:37:04.531190-07:00', 'cbcf7248-8552-458d-b6c9-8aa031c81747', 'e0e8aa82-4c27-4ce1-b2d6-f0bd199d5b07');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('a12c02f8-c8f5-40ad-807d-59a3b49e2dac', 'EXPIRED-551092', 10, 0, 0, '2026-05-09', '2026-05-14', NULL, NULL, 'Expired', '2026-05-13 23:37:04.532371-07:00', '2026-05-13 23:37:04.532377-07:00', 'cbcf7248-8552-458d-b6c9-8aa031c81747', 'e0e8aa82-4c27-4ce1-b2d6-f0bd199d5b07');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('781e9f8e-203e-4160-8352-3ba2a83315ec', 'BATCH-01CD2D', 100, 0, 0, '2026-06-13', '2026-05-14', NULL, NULL, 'active', '2026-05-13 23:37:04.534059-07:00', '2026-05-13 23:37:04.534066-07:00', 'cbcf7248-8552-458d-b6c9-8aa031c81747', 'd4e0bb21-b148-42f9-a4f3-ba2f4cf7a217');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('773e87dc-412e-4888-ae07-08dd27b68bd6', 'EXPIRED-1AC9F8', 10, 0, 0, '2026-05-09', '2026-05-14', NULL, NULL, 'Expired', '2026-05-13 23:37:04.535170-07:00', '2026-05-13 23:37:04.535176-07:00', 'cbcf7248-8552-458d-b6c9-8aa031c81747', 'd4e0bb21-b148-42f9-a4f3-ba2f4cf7a217');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('6251b8d1-1007-4a06-99f3-48afba4da745', 'BATCH-1A02E6', 100, 0, 0, '2026-06-13', '2026-05-14', NULL, NULL, 'active', '2026-05-13 23:37:04.537906-07:00', '2026-05-13 23:37:04.537931-07:00', 'e70b410d-d4c3-48d0-a72d-0e7c22c9ab02', '0aab8559-7f49-4f91-b72b-a67d51013cd2');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('e468aec5-311b-43cc-b5a2-2f54244cb7f7', 'EXPIRED-0F36E1', 10, 0, 0, '2026-05-09', '2026-05-14', NULL, NULL, 'Expired', '2026-05-13 23:37:04.539611-07:00', '2026-05-13 23:37:04.539618-07:00', 'e70b410d-d4c3-48d0-a72d-0e7c22c9ab02', '0aab8559-7f49-4f91-b72b-a67d51013cd2');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('078c1405-a090-4d71-a7d7-baa065f51cac', 'BATCH-4B3C15', 100, 0, 0, '2026-06-13', '2026-05-14', NULL, NULL, 'active', '2026-05-13 23:37:04.541691-07:00', '2026-05-13 23:37:04.541702-07:00', 'e70b410d-d4c3-48d0-a72d-0e7c22c9ab02', 'e0e8aa82-4c27-4ce1-b2d6-f0bd199d5b07');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('c00f69a3-5603-4dad-b286-bcd5977afceb', 'EXPIRED-D9E213', 10, 0, 0, '2026-05-09', '2026-05-14', NULL, NULL, 'Expired', '2026-05-13 23:37:04.543014-07:00', '2026-05-13 23:37:04.543020-07:00', 'e70b410d-d4c3-48d0-a72d-0e7c22c9ab02', 'e0e8aa82-4c27-4ce1-b2d6-f0bd199d5b07');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('e0c90c91-1726-4f20-9220-c4294a70955c', 'BATCH-15F6FD', 100, 0, 0, '2026-06-13', '2026-05-14', NULL, NULL, 'active', '2026-05-13 23:37:04.545951-07:00', '2026-05-13 23:37:04.545957-07:00', 'e70b410d-d4c3-48d0-a72d-0e7c22c9ab02', 'd4e0bb21-b148-42f9-a4f3-ba2f4cf7a217');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('7a3caadc-0ad9-442a-acca-08819ccb7404', 'EXPIRED-FEA279', 10, 0, 0, '2026-05-09', '2026-05-14', NULL, NULL, 'Expired', '2026-05-13 23:37:04.547755-07:00', '2026-05-13 23:37:04.547766-07:00', 'e70b410d-d4c3-48d0-a72d-0e7c22c9ab02', 'd4e0bb21-b148-42f9-a4f3-ba2f4cf7a217');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('f2c1f3dc-be18-4f09-9752-c54d641f61e3', 'BATCH-47EB17', 100, 0, 0, '2026-05-19', '2026-05-14', NULL, NULL, 'active', '2026-05-14 00:08:08.598695-07:00', '2026-05-14 00:08:08.598740-07:00', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', '0aab8559-7f49-4f91-b72b-a67d51013cd2');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('618cd009-9a91-4564-b2a2-eb8bea1ed295', 'BATCH-B00B0E', 100, 0, 0, '2026-06-13', '2026-05-14', NULL, NULL, 'active', '2026-05-14 00:08:08.693883-07:00', '2026-05-14 00:08:08.693911-07:00', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', 'e0e8aa82-4c27-4ce1-b2d6-f0bd199d5b07');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('b8132c60-446c-44e4-bf57-e716a120d7b0', 'BATCH-9EBB74', 100, 0, 0, '2026-05-19', '2026-05-14', NULL, NULL, 'active', '2026-05-14 00:08:08.719691-07:00', '2026-05-14 00:08:08.719713-07:00', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', 'd4e0bb21-b148-42f9-a4f3-ba2f4cf7a217');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('0f9cfbeb-a34b-4c24-9a85-7f890e63bf2b', 'BATCH-44BAE8', 100, 0, 0, '2026-06-13', '2026-05-14', NULL, NULL, 'active', '2026-05-14 00:08:08.743231-07:00', '2026-05-14 00:08:08.743257-07:00', 'cbcf7248-8552-458d-b6c9-8aa031c81747', '0aab8559-7f49-4f91-b72b-a67d51013cd2');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('625e37ba-61fd-4870-917c-141d076c60b1', 'BATCH-91F9A6', 100, 0, 0, '2026-05-19', '2026-05-14', NULL, NULL, 'active', '2026-05-14 00:08:08.767249-07:00', '2026-05-14 00:08:08.767272-07:00', 'cbcf7248-8552-458d-b6c9-8aa031c81747', 'e0e8aa82-4c27-4ce1-b2d6-f0bd199d5b07');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('59b21a39-7f3a-4243-9087-d98f9ced7a1b', 'BATCH-A33396', 100, 0, 0, '2026-06-13', '2026-05-14', NULL, NULL, 'active', '2026-05-14 00:08:08.790855-07:00', '2026-05-14 00:08:08.790881-07:00', 'cbcf7248-8552-458d-b6c9-8aa031c81747', 'd4e0bb21-b148-42f9-a4f3-ba2f4cf7a217');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('42ce6308-5ed6-4422-9976-a8e89d41607e', 'BATCH-47EC5F', 100, 0, 0, '2026-05-19', '2026-05-14', NULL, NULL, 'active', '2026-05-14 00:08:08.814692-07:00', '2026-05-14 00:08:08.814714-07:00', 'e70b410d-d4c3-48d0-a72d-0e7c22c9ab02', '0aab8559-7f49-4f91-b72b-a67d51013cd2');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('636e8314-cdf3-43cf-a0b2-022596a6d52a', 'BATCH-0F8EAB', 100, 0, 0, '2026-06-13', '2026-05-14', NULL, NULL, 'active', '2026-05-14 00:08:08.838762-07:00', '2026-05-14 00:08:08.838784-07:00', 'e70b410d-d4c3-48d0-a72d-0e7c22c9ab02', 'e0e8aa82-4c27-4ce1-b2d6-f0bd199d5b07');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('9ccbddd9-4a2b-4512-a696-73fa6bbb7a74', 'BATCH-5D9D6A', 100, 0, 0, '2026-05-19', '2026-05-14', NULL, NULL, 'active', '2026-05-14 00:08:08.858938-07:00', '2026-05-14 00:08:08.858959-07:00', 'e70b410d-d4c3-48d0-a72d-0e7c22c9ab02', 'd4e0bb21-b148-42f9-a4f3-ba2f4cf7a217');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('4477ecb3-e7ec-4b0d-bbed-3626823d2cf2', 'BATCH-D31BBE', 100, 0, 0, '2026-05-19', '2026-05-14', NULL, NULL, 'active', '2026-05-14 00:09:07.607221-07:00', '2026-05-14 00:09:07.607267-07:00', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', '0aab8559-7f49-4f91-b72b-a67d51013cd2');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('e5c671a7-ea14-458c-b758-9e35bda7d1f1', 'BATCH-E7E27C', 100, 0, 0, '2026-06-13', '2026-05-14', NULL, NULL, 'active', '2026-05-14 00:09:07.647145-07:00', '2026-05-14 00:09:07.647168-07:00', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', 'e0e8aa82-4c27-4ce1-b2d6-f0bd199d5b07');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('b5510881-ce9d-4aa4-9d11-f4b7f64a2ba8', 'BATCH-7DD6FE', 100, 0, 0, '2026-05-19', '2026-05-14', NULL, NULL, 'active', '2026-05-14 00:09:07.661128-07:00', '2026-05-14 00:09:07.661158-07:00', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', 'd4e0bb21-b148-42f9-a4f3-ba2f4cf7a217');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('e5d2a55c-93cd-4698-8d6d-a5bb1f3b5603', 'BATCH-92978E', 100, 0, 0, '2026-06-13', '2026-05-14', NULL, NULL, 'active', '2026-05-14 00:09:07.674554-07:00', '2026-05-14 00:09:07.674577-07:00', 'cbcf7248-8552-458d-b6c9-8aa031c81747', '0aab8559-7f49-4f91-b72b-a67d51013cd2');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('98212f4a-a702-48f3-b641-bdb14d1956b9', 'BATCH-3DC33A', 100, 0, 0, '2026-05-19', '2026-05-14', NULL, NULL, 'active', '2026-05-14 00:09:07.688275-07:00', '2026-05-14 00:09:07.688297-07:00', 'cbcf7248-8552-458d-b6c9-8aa031c81747', 'e0e8aa82-4c27-4ce1-b2d6-f0bd199d5b07');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('ef11474c-0dfe-4d4d-99d2-c14c45e7fba4', 'BATCH-20EC7C', 100, 0, 0, '2026-06-13', '2026-05-14', NULL, NULL, 'active', '2026-05-14 00:09:07.701832-07:00', '2026-05-14 00:09:07.701865-07:00', 'cbcf7248-8552-458d-b6c9-8aa031c81747', 'd4e0bb21-b148-42f9-a4f3-ba2f4cf7a217');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('ef0033c3-f4e5-4f44-932d-2386b2b60bd9', 'BATCH-A58E80', 100, 0, 0, '2026-05-19', '2026-05-14', NULL, NULL, 'active', '2026-05-14 00:09:07.717484-07:00', '2026-05-14 00:09:07.717508-07:00', 'e70b410d-d4c3-48d0-a72d-0e7c22c9ab02', '0aab8559-7f49-4f91-b72b-a67d51013cd2');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('70deca1e-d42e-4941-b5c1-7f2e5358a872', 'BATCH-D0254F', 100, 0, 0, '2026-06-13', '2026-05-14', NULL, NULL, 'active', '2026-05-14 00:09:07.729511-07:00', '2026-05-14 00:09:07.729534-07:00', 'e70b410d-d4c3-48d0-a72d-0e7c22c9ab02', 'e0e8aa82-4c27-4ce1-b2d6-f0bd199d5b07');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('24fad4d0-3aee-485a-ad43-9a9e3cda6670', 'BATCH-2E7F3C', 100, 0, 0, '2026-05-19', '2026-05-14', NULL, NULL, 'active', '2026-05-14 00:09:07.742622-07:00', '2026-05-14 00:09:07.742644-07:00', 'e70b410d-d4c3-48d0-a72d-0e7c22c9ab02', 'd4e0bb21-b148-42f9-a4f3-ba2f4cf7a217');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('c16ad09e-8847-44d7-81ac-bdc37f29e2a4', 'BATCH-6B39E8', 100, 0, 0, '2026-05-19', '2026-05-14', NULL, NULL, 'active', '2026-05-14 00:12:53.507718-07:00', '2026-05-14 00:12:53.507797-07:00', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', '0aab8559-7f49-4f91-b72b-a67d51013cd2');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('635b9168-66ef-420f-8afd-7dc0a58fb031', 'BATCH-7EA44E', 100, 0, 0, '2026-06-13', '2026-05-14', NULL, NULL, 'active', '2026-05-14 00:12:53.593943-07:00', '2026-05-14 00:12:53.593979-07:00', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', 'e0e8aa82-4c27-4ce1-b2d6-f0bd199d5b07');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('b6f03870-517d-4ada-86c2-bc6d0e67fd90', 'BATCH-27EB0A', 100, 0, 0, '2026-05-19', '2026-05-14', NULL, NULL, 'active', '2026-05-14 00:12:53.631238-07:00', '2026-05-14 00:12:53.631318-07:00', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', 'd4e0bb21-b148-42f9-a4f3-ba2f4cf7a217');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('c8c786a8-1f44-4e41-adf8-dab4464a4863', 'BATCH-9F7917', 100, 0, 0, '2026-06-13', '2026-05-14', NULL, NULL, 'active', '2026-05-14 00:12:53.666930-07:00', '2026-05-14 00:12:53.666969-07:00', 'cbcf7248-8552-458d-b6c9-8aa031c81747', '0aab8559-7f49-4f91-b72b-a67d51013cd2');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('552fb744-d3d1-4f5a-8641-856f63fa58ce', 'BATCH-33C69E', 100, 0, 0, '2026-05-19', '2026-05-14', NULL, NULL, 'active', '2026-05-14 00:12:53.712610-07:00', '2026-05-14 00:12:53.712646-07:00', 'cbcf7248-8552-458d-b6c9-8aa031c81747', 'e0e8aa82-4c27-4ce1-b2d6-f0bd199d5b07');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('cf87067b-e427-496b-95c5-070d544a9d45', 'BATCH-A5D5F8', 100, 0, 0, '2026-06-13', '2026-05-14', NULL, NULL, 'active', '2026-05-14 00:12:53.755088-07:00', '2026-05-14 00:12:53.755136-07:00', 'cbcf7248-8552-458d-b6c9-8aa031c81747', 'd4e0bb21-b148-42f9-a4f3-ba2f4cf7a217');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('bebac96b-6b3a-4fcf-9bb0-8985d0401021', 'BATCH-C68357', 100, 0, 0, '2026-05-19', '2026-05-14', NULL, NULL, 'active', '2026-05-14 00:12:53.781161-07:00', '2026-05-14 00:12:53.781199-07:00', 'e70b410d-d4c3-48d0-a72d-0e7c22c9ab02', '0aab8559-7f49-4f91-b72b-a67d51013cd2');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('5686f637-9381-458c-b476-721360ddec34', 'BATCH-954ECA', 100, 0, 0, '2026-06-13', '2026-05-14', NULL, NULL, 'active', '2026-05-14 00:12:53.809402-07:00', '2026-05-14 00:12:53.809441-07:00', 'e70b410d-d4c3-48d0-a72d-0e7c22c9ab02', 'e0e8aa82-4c27-4ce1-b2d6-f0bd199d5b07');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('f765c8fe-7f10-430d-a520-544d9c94fa44', 'BATCH-D49C16', 100, 0, 0, '2026-05-19', '2026-05-14', NULL, NULL, 'active', '2026-05-14 00:12:53.832776-07:00', '2026-05-14 00:12:53.832813-07:00', 'e70b410d-d4c3-48d0-a72d-0e7c22c9ab02', 'd4e0bb21-b148-42f9-a4f3-ba2f4cf7a217');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('c7b0db4f-7d29-4263-92cd-e831565ff265', 'BATCH-785294', 59, 59, 0, '2026-06-11', '2026-05-14', 'Shelf Rack 1', NULL, 'active', '2026-05-14 04:03:03.053438-07:00', '2026-05-14 04:03:03.053454-07:00', '336c28f2-4d43-4b4f-a659-bb157c5ca432', 'd46357bb-48aa-49a3-a1a4-e855e309d1b4');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('b10ff8c9-3986-43fe-b71f-97198dc8c0eb', 'BATCH-A540F3', 109, 109, 0, '2026-06-13', '2026-05-14', 'Cooler Section A', NULL, 'active', '2026-05-14 04:03:03.070561-07:00', '2026-05-14 04:03:03.070572-07:00', '336c28f2-4d43-4b4f-a659-bb157c5ca432', '881ac5f1-f7f9-4bde-a73c-772c2e9f4aa5');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('3f76ceca-8181-4c72-833a-3e9a83dd3625', 'BATCH-A52627', 21, 21, 0, '2026-06-07', '2026-05-14', 'Cooler Section A', NULL, 'active', '2026-05-14 04:03:03.073077-07:00', '2026-05-14 04:03:03.073086-07:00', '336c28f2-4d43-4b4f-a659-bb157c5ca432', 'aee4d56b-2e54-47ba-8af2-2e4a5bba868e');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('f283ce53-040c-4f6f-ad6f-bc1670d0f244', 'BATCH-97CF44', 58, 58, 0, '2026-05-17', '2026-05-14', 'Shelf Rack 1', NULL, 'active', '2026-05-14 04:03:03.075282-07:00', '2026-05-14 04:03:03.075290-07:00', '336c28f2-4d43-4b4f-a659-bb157c5ca432', 'f41b6cfd-57e0-4067-8cfe-d0e13dff8419');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('c83722e3-83e9-4a1b-b34c-8dc924ccdae5', 'BATCH-CE953C', 38, 38, 0, '2026-05-26', '2026-05-14', 'Cooler Section A', NULL, 'active', '2026-05-14 04:03:03.077381-07:00', '2026-05-14 04:03:03.077389-07:00', '336c28f2-4d43-4b4f-a659-bb157c5ca432', '5cafb430-4149-4940-917a-698ac15d2e48');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('1fd83748-e6b9-4899-95e9-ea56c43bd085', 'BATCH-A5253F', 109, 109, 0, '2026-06-09', '2026-05-14', 'Shelf Rack 1', NULL, 'active', '2026-05-14 04:03:03.081039-07:00', '2026-05-14 04:03:03.081055-07:00', '336c28f2-4d43-4b4f-a659-bb157c5ca432', '10ba8eab-20a1-4615-8b68-14b516bbfd66');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('dfdd1f1d-496d-46b9-95bf-92c39cf7c407', 'BATCH-30DBA9', 84, 84, 0, '2026-06-03', '2026-05-14', 'Shelf Rack 1', NULL, 'active', '2026-05-14 04:03:03.085215-07:00', '2026-05-14 04:03:03.085230-07:00', '336c28f2-4d43-4b4f-a659-bb157c5ca432', '064e1324-ab2c-454e-bfbc-385cc4a5c831');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('b0feae4e-26e9-427d-817b-da5964685a06', 'BATCH-75725D', 49, 49, 0, '2026-06-09', '2026-05-14', 'Cooler Section A', NULL, 'active', '2026-05-14 04:03:03.087954-07:00', '2026-05-14 04:03:03.087963-07:00', '336c28f2-4d43-4b4f-a659-bb157c5ca432', 'c8427e43-a39b-4bf5-87b0-fdbd816fc814');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('9742d9bc-5435-4f89-ad94-f50ff4eb4e2b', 'BATCH-219244', 75, 75, 0, '2026-05-21', '2026-05-14', 'Cooler Section A', NULL, 'active', '2026-05-14 04:03:03.090495-07:00', '2026-05-14 04:03:03.090504-07:00', '0130b83e-5e0a-4ed6-bc12-4fdc08f46c27', '5cafb430-4149-4940-917a-698ac15d2e48');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('1a3f71f7-52c6-4040-9528-299b06b5056d', 'BATCH-6110F9', 108, 108, 0, '2026-06-05', '2026-05-14', 'Cooler Section A', NULL, 'active', '2026-05-14 04:03:03.092538-07:00', '2026-05-14 04:03:03.092546-07:00', '0130b83e-5e0a-4ed6-bc12-4fdc08f46c27', '881ac5f1-f7f9-4bde-a73c-772c2e9f4aa5');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('530583fd-4d86-4448-ad54-8031d2a3a6bb', 'BATCH-C474C7', 53, 53, 0, '2026-06-02', '2026-05-14', 'Cooler Section A', NULL, 'active', '2026-05-14 04:03:03.094947-07:00', '2026-05-14 04:03:03.094956-07:00', '0130b83e-5e0a-4ed6-bc12-4fdc08f46c27', 'b8324031-f1a5-47ef-b907-5346171c36a9');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('2de3560c-4915-4210-83c7-8cfff8f098eb', 'BATCH-04082B', 109, 109, 0, '2026-05-22', '2026-05-14', 'Shelf Rack 1', NULL, 'active', '2026-05-14 04:03:03.099138-07:00', '2026-05-14 04:03:03.099149-07:00', '0130b83e-5e0a-4ed6-bc12-4fdc08f46c27', 'f41b6cfd-57e0-4067-8cfe-d0e13dff8419');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('9a3681f1-9140-4ec2-9ed7-c47c31e5a25f', 'BATCH-E7E4B2', 73, 73, 0, '2026-06-02', '2026-05-14', 'Cooler Section A', NULL, 'active', '2026-05-14 04:03:03.101831-07:00', '2026-05-14 04:03:03.101839-07:00', '0130b83e-5e0a-4ed6-bc12-4fdc08f46c27', 'aee4d56b-2e54-47ba-8af2-2e4a5bba868e');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('308c7724-9929-4903-bb37-929b22be4e99', 'BATCH-35375A', 67, 67, 0, '2026-05-15', '2026-05-14', 'Shelf Rack 1', NULL, 'active', '2026-05-14 04:03:03.104182-07:00', '2026-05-14 04:03:03.104190-07:00', '0130b83e-5e0a-4ed6-bc12-4fdc08f46c27', '10ba8eab-20a1-4615-8b68-14b516bbfd66');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('f1ae2f30-d234-486f-b09b-deef8d6b36aa', 'BATCH-6F422B', 97, 97, 0, '2026-05-18', '2026-05-14', 'Cooler Section A', NULL, 'active', '2026-05-14 04:03:03.106171-07:00', '2026-05-14 04:03:03.106179-07:00', '0130b83e-5e0a-4ed6-bc12-4fdc08f46c27', 'abc19a1a-c9ac-400d-a079-5e9bca00b29b');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('e01c93cd-f22c-402b-b468-656bd8f01d1a', 'BATCH-EEADB3', 86, 86, 0, '2026-05-29', '2026-05-14', 'Cooler Section A', NULL, 'active', '2026-05-14 04:03:03.108065-07:00', '2026-05-14 04:03:03.108073-07:00', '0130b83e-5e0a-4ed6-bc12-4fdc08f46c27', '8b8202df-721d-4b3d-8963-0eed4ca6f409');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('853e0da6-2cec-402d-a64a-846cf1f8211e', 'BATCH-C4344D', 120, 120, 0, '2026-06-05', '2026-05-14', 'Cooler Section A', NULL, 'active', '2026-05-14 04:03:03.110047-07:00', '2026-05-14 04:03:03.110054-07:00', '04c4dbd7-3d17-46bb-814d-e7d3111577ac', 'b8324031-f1a5-47ef-b907-5346171c36a9');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('a74d046a-14c3-4694-aa34-e4dc06533ec4', 'BATCH-8ABCA1', 78, 78, 0, '2026-06-08', '2026-05-14', 'Shelf Rack 1', NULL, 'active', '2026-05-14 04:03:03.113316-07:00', '2026-05-14 04:03:03.113331-07:00', '04c4dbd7-3d17-46bb-814d-e7d3111577ac', '064e1324-ab2c-454e-bfbc-385cc4a5c831');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('8756986f-6585-4814-9f16-b22390901fee', 'BATCH-44345C', 76, 76, 0, '2026-05-23', '2026-05-14', 'Shelf Rack 1', NULL, 'active', '2026-05-14 04:03:03.116896-07:00', '2026-05-14 04:03:03.116905-07:00', '04c4dbd7-3d17-46bb-814d-e7d3111577ac', 'f41b6cfd-57e0-4067-8cfe-d0e13dff8419');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('5608e2a3-2088-462a-ac5c-4e92e196f2d2', 'BATCH-8F3A94', 42, 42, 0, '2026-05-24', '2026-05-14', 'Cooler Section A', NULL, 'active', '2026-05-14 04:03:03.119356-07:00', '2026-05-14 04:03:03.119364-07:00', '04c4dbd7-3d17-46bb-814d-e7d3111577ac', '5cafb430-4149-4940-917a-698ac15d2e48');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('dfc1f731-c1c0-437c-aad8-769905521038', 'BATCH-93E1C7', 61, 61, 0, '2026-05-18', '2026-05-14', 'Cooler Section A', NULL, 'active', '2026-05-14 04:03:03.121359-07:00', '2026-05-14 04:03:03.121366-07:00', '04c4dbd7-3d17-46bb-814d-e7d3111577ac', 'aee4d56b-2e54-47ba-8af2-2e4a5bba868e');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('9c0b766c-0c26-432b-b8f9-4b8a20e4be80', 'BATCH-AA682A', 101, 101, 0, '2026-05-27', '2026-05-14', 'Shelf Rack 1', NULL, 'active', '2026-05-14 04:03:03.123191-07:00', '2026-05-14 04:03:03.123198-07:00', '04c4dbd7-3d17-46bb-814d-e7d3111577ac', 'd46357bb-48aa-49a3-a1a4-e855e309d1b4');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('abea7b7d-b91b-49d7-94a0-04231912b55c', 'BATCH-51DC8C', 34, 34, 0, '2026-06-05', '2026-05-14', 'Shelf Rack 1', NULL, 'active', '2026-05-14 04:03:03.124881-07:00', '2026-05-14 04:03:03.124888-07:00', '04c4dbd7-3d17-46bb-814d-e7d3111577ac', 'e278bab5-191b-4cff-9e6d-03662a1de45b');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('e463943e-2ceb-4125-8225-2b8f7399b942', 'BATCH-AAC91E', 43, 43, 0, '2026-06-07', '2026-05-14', 'Shelf Rack 1', NULL, 'active', '2026-05-14 04:03:03.126550-07:00', '2026-05-14 04:03:03.126556-07:00', '04c4dbd7-3d17-46bb-814d-e7d3111577ac', '10ba8eab-20a1-4615-8b68-14b516bbfd66');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('84a811e0-e106-463a-9e2b-7390ac4029b3', 'BATCH-B30867', 102, 102, 0, '2026-05-30', '2026-05-14', 'Cooler Section A', NULL, 'active', '2026-05-14 04:03:03.128401-07:00', '2026-05-14 04:03:03.128408-07:00', 'ea9e7c28-6f35-4346-b25f-5ddb094f095a', 'c8427e43-a39b-4bf5-87b0-fdbd816fc814');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('63cbe492-c579-40f6-915f-3576208f3de8', 'BATCH-030490', 49, 49, 0, '2026-06-12', '2026-05-14', 'Shelf Rack 1', NULL, 'active', '2026-05-14 04:03:03.131747-07:00', '2026-05-14 04:03:03.131754-07:00', 'ea9e7c28-6f35-4346-b25f-5ddb094f095a', 'f41b6cfd-57e0-4067-8cfe-d0e13dff8419');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('6c8d43c4-0ecd-4841-81a9-495906f8560b', 'BATCH-A8E900', 40, 40, 0, '2026-05-28', '2026-05-14', 'Shelf Rack 1', NULL, 'active', '2026-05-14 04:03:03.134820-07:00', '2026-05-14 04:03:03.134826-07:00', 'ea9e7c28-6f35-4346-b25f-5ddb094f095a', '10ba8eab-20a1-4615-8b68-14b516bbfd66');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('40c257b5-8844-4b63-9fc5-74ad7bb13b7a', 'BATCH-3C41FA', 37, 37, 0, '2026-06-09', '2026-05-14', 'Shelf Rack 1', NULL, 'active', '2026-05-14 04:03:03.137664-07:00', '2026-05-14 04:03:03.137677-07:00', 'ea9e7c28-6f35-4346-b25f-5ddb094f095a', 'd46357bb-48aa-49a3-a1a4-e855e309d1b4');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('90711e17-b47c-457f-95e7-567849b291c7', 'BATCH-786D4C', 73, 73, 0, '2026-06-11', '2026-05-14', 'Cooler Section A', NULL, 'active', '2026-05-14 04:03:03.140483-07:00', '2026-05-14 04:03:03.140490-07:00', 'ea9e7c28-6f35-4346-b25f-5ddb094f095a', 'b4190d73-d742-415c-a258-d5c735f58800');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('afe16d75-7d79-469b-bb1c-bbf3ceb370d1', 'BATCH-6B142D', 76, 76, 0, '2026-06-05', '2026-05-14', 'Shelf Rack 1', NULL, 'active', '2026-05-14 04:03:03.143459-07:00', '2026-05-14 04:03:03.143466-07:00', 'ea9e7c28-6f35-4346-b25f-5ddb094f095a', 'e278bab5-191b-4cff-9e6d-03662a1de45b');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('d055a791-0336-4b51-9888-3828975f01d6', 'BATCH-10E393', 99, 99, 0, '2026-05-17', '2026-05-14', 'Cooler Section A', NULL, 'active', '2026-05-14 04:03:03.146719-07:00', '2026-05-14 04:03:03.146735-07:00', 'ea9e7c28-6f35-4346-b25f-5ddb094f095a', 'abc19a1a-c9ac-400d-a079-5e9bca00b29b');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('3f3df9fb-629c-4688-9630-4403b657195f', 'BATCH-5937FC', 96, 96, 0, '2026-05-30', '2026-05-14', 'Cooler Section A', NULL, 'active', '2026-05-14 04:03:03.150115-07:00', '2026-05-14 04:03:03.150122-07:00', 'ea9e7c28-6f35-4346-b25f-5ddb094f095a', '881ac5f1-f7f9-4bde-a73c-772c2e9f4aa5');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('e324f50b-06ad-4cab-8903-a3ae469e8288', 'BATCH-F41F81', 26, 26, 0, '2026-06-08', '2026-05-14', 'Shelf Rack 1', NULL, 'active', '2026-05-14 04:03:03.152668-07:00', '2026-05-14 04:03:03.152676-07:00', '3ea7fb17-2bed-45bb-9162-8946414dcf8d', 'd46357bb-48aa-49a3-a1a4-e855e309d1b4');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('6e60e85a-c5ee-4659-a971-0dfddd49e392', 'BATCH-46BAEC', 63, 63, 0, '2026-05-17', '2026-05-14', 'Cooler Section A', NULL, 'active', '2026-05-14 04:03:03.154289-07:00', '2026-05-14 04:03:03.154296-07:00', '3ea7fb17-2bed-45bb-9162-8946414dcf8d', 'b4190d73-d742-415c-a258-d5c735f58800');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('581746dc-10ba-4e9c-952c-37b2ec49bb58', 'BATCH-3AE6BC', 48, 48, 0, '2026-06-13', '2026-05-14', 'Shelf Rack 1', NULL, 'active', '2026-05-14 04:03:03.155772-07:00', '2026-05-14 04:03:03.155777-07:00', '3ea7fb17-2bed-45bb-9162-8946414dcf8d', '10ba8eab-20a1-4615-8b68-14b516bbfd66');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('62b1a2df-e5c3-46c9-962c-b959c2c3f7d2', 'BATCH-6BB7BC', 84, 84, 0, '2026-05-18', '2026-05-14', 'Shelf Rack 1', NULL, 'active', '2026-05-14 04:03:03.157643-07:00', '2026-05-14 04:03:03.157649-07:00', '3ea7fb17-2bed-45bb-9162-8946414dcf8d', '064e1324-ab2c-454e-bfbc-385cc4a5c831');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('be4bf91d-3b8c-42d9-998a-2114b299c706', 'BATCH-1D1AD2', 34, 34, 0, '2026-05-31', '2026-05-14', 'Cooler Section A', NULL, 'active', '2026-05-14 04:03:03.159377-07:00', '2026-05-14 04:03:03.159383-07:00', '3ea7fb17-2bed-45bb-9162-8946414dcf8d', '881ac5f1-f7f9-4bde-a73c-772c2e9f4aa5');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('9631e89d-1cc1-46ea-9dde-a6783c0b864b', 'BATCH-69E6D9', 67, 67, 0, '2026-05-15', '2026-05-14', 'Cooler Section A', NULL, 'active', '2026-05-14 04:03:03.160863-07:00', '2026-05-14 04:03:03.160869-07:00', '3ea7fb17-2bed-45bb-9162-8946414dcf8d', 'b8324031-f1a5-47ef-b907-5346171c36a9');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('bf7a288a-18f2-4e0a-b8bd-841a6c61eaed', 'BATCH-2AA01A', 39, 39, 0, '2026-06-12', '2026-05-14', 'Cooler Section A', NULL, 'active', '2026-05-14 04:03:03.164838-07:00', '2026-05-14 04:03:03.164846-07:00', '3ea7fb17-2bed-45bb-9162-8946414dcf8d', '8b8202df-721d-4b3d-8963-0eed4ca6f409');
INSERT INTO inventory_stockitem (id, batch_number, quantity, received_quantity, damaged_quantity, expiry_date, received_date, storage_location, storage_zone, status, created_at, updated_at, branch_id, product_id) VALUES ('e1e6427e-e1ee-4440-9140-9c704bebecb4', 'BATCH-A0A984', 73, 73, 0, '2026-05-29', '2026-05-14', 'Shelf Rack 1', NULL, 'active', '2026-05-14 04:03:03.166870-07:00', '2026-05-14 04:03:03.166878-07:00', '3ea7fb17-2bed-45bb-9162-8946414dcf8d', 'e278bab5-191b-4cff-9e6d-03662a1de45b');
```

### Data for inventory_transfer
```sql
INSERT INTO inventory_transfer (id, quantity, status, reason, driver_name, eta, delivered_at, received_at, created_at, updated_at, from_branch_id, product_id, received_by_id, stock_item_id, to_branch_id) VALUES ('90a302a9-ab39-40bf-a97e-e3e3c1aa7688', 50, 'delivered', 'Excess stock - preventing waste', 'Ali M.', 'Arrived', '2026-05-14 00:21:38.277962-07:00', NULL, '2026-05-14 04:21:38.328600-07:00', '2026-05-14 04:21:38.328611-07:00', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', 'facdb5a4-b5d2-4dfc-b664-ff25d69cdd8e', NULL, NULL, 'cbcf7248-8552-458d-b6c9-8aa031c81747');
INSERT INTO inventory_transfer (id, quantity, status, reason, driver_name, eta, delivered_at, received_at, created_at, updated_at, from_branch_id, product_id, received_by_id, stock_item_id, to_branch_id) VALUES ('2e5674d8-8e32-43cd-a96e-7099a3bd8ece', 30, 'in_transit', 'Stock shortage at Downtown', 'Vugar R.', '45 mins', NULL, NULL, '2026-05-14 04:21:38.338795-07:00', '2026-05-14 04:21:38.338806-07:00', 'cbcf7248-8552-458d-b6c9-8aa031c81747', '8e4f6089-c842-413f-9bed-724197c8324f', NULL, NULL, '4c58b56a-7293-49e2-b86b-bd7dfea16fe7');
INSERT INTO inventory_transfer (id, quantity, status, reason, driver_name, eta, delivered_at, received_at, created_at, updated_at, from_branch_id, product_id, received_by_id, stock_item_id, to_branch_id) VALUES ('0698d302-70ca-4575-b4d0-f844365f9d70', 20, 'pending', 'AI Recommendation: High demand at target', NULL, NULL, NULL, NULL, '2026-05-14 04:21:38.341126-07:00', '2026-05-14 04:21:38.341134-07:00', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', 'facdb5a4-b5d2-4dfc-b664-ff25d69cdd8e', NULL, NULL, 'cbcf7248-8552-458d-b6c9-8aa031c81747');
```

### Data for supply_chain_invoice
```sql
INSERT INTO supply_chain_invoice (id, code, amount, due_date, received_date, status, match_status, match_results, po_id) VALUES (1, 'INV-0000', '1500.00', '2026-05-29', NULL, 'pending', '3-WAY MATCH COMPLETE', '{}', 1);
INSERT INTO supply_chain_invoice (id, code, amount, due_date, received_date, status, match_status, match_results, po_id) VALUES (2, 'INV-0001', '1550.00', '2026-05-29', NULL, 'paid', 'DISCREPANCY DETECTED', '{}', 2);
INSERT INTO supply_chain_invoice (id, code, amount, due_date, received_date, status, match_status, match_results, po_id) VALUES (3, 'INV-0002', '1600.00', '2026-05-29', NULL, 'pending', '3-WAY MATCH COMPLETE', '{}', 3);
INSERT INTO supply_chain_invoice (id, code, amount, due_date, received_date, status, match_status, match_results, po_id) VALUES (4, 'INV-0010', '1600.00', '2026-05-29', NULL, 'paid', 'DISCREPANCY DETECTED', '{}', 4);
INSERT INTO supply_chain_invoice (id, code, amount, due_date, received_date, status, match_status, match_results, po_id) VALUES (5, 'INV-0011', '1650.00', '2026-05-29', NULL, 'pending', '3-WAY MATCH COMPLETE', '{}', 5);
INSERT INTO supply_chain_invoice (id, code, amount, due_date, received_date, status, match_status, match_results, po_id) VALUES (6, 'INV-0012', '1700.00', '2026-05-29', NULL, 'paid', 'DISCREPANCY DETECTED', '{}', 6);
INSERT INTO supply_chain_invoice (id, code, amount, due_date, received_date, status, match_status, match_results, po_id) VALUES (7, 'INV-0020', '1700.00', '2026-05-29', NULL, 'pending', '3-WAY MATCH COMPLETE', '{}', 7);
INSERT INTO supply_chain_invoice (id, code, amount, due_date, received_date, status, match_status, match_results, po_id) VALUES (8, 'INV-0021', '1750.00', '2026-05-29', NULL, 'paid', 'DISCREPANCY DETECTED', '{}', 8);
INSERT INTO supply_chain_invoice (id, code, amount, due_date, received_date, status, match_status, match_results, po_id) VALUES (9, 'INV-0022', '1800.00', '2026-05-29', NULL, 'pending', '3-WAY MATCH COMPLETE', '{}', 9);
```

### Data for supply_chain_purchaseorder
```sql
INSERT INTO supply_chain_purchaseorder (id, code, amount, date, status, items, branch_id, vendor_id) VALUES (1, 'PO-0000', '1500.00', '2026-05-14', 'delivered', '[]', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', 1);
INSERT INTO supply_chain_purchaseorder (id, code, amount, date, status, items, branch_id, vendor_id) VALUES (2, 'PO-0001', '1550.00', '2026-05-14', 'pending', '[]', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', 2);
INSERT INTO supply_chain_purchaseorder (id, code, amount, date, status, items, branch_id, vendor_id) VALUES (3, 'PO-0002', '1600.00', '2026-05-14', 'delivered', '[]', '4c58b56a-7293-49e2-b86b-bd7dfea16fe7', 3);
INSERT INTO supply_chain_purchaseorder (id, code, amount, date, status, items, branch_id, vendor_id) VALUES (4, 'PO-0010', '1600.00', '2026-05-14', 'pending', '[]', 'cbcf7248-8552-458d-b6c9-8aa031c81747', 1);
INSERT INTO supply_chain_purchaseorder (id, code, amount, date, status, items, branch_id, vendor_id) VALUES (5, 'PO-0011', '1650.00', '2026-05-14', 'delivered', '[]', 'cbcf7248-8552-458d-b6c9-8aa031c81747', 2);
INSERT INTO supply_chain_purchaseorder (id, code, amount, date, status, items, branch_id, vendor_id) VALUES (6, 'PO-0012', '1700.00', '2026-05-14', 'pending', '[]', 'cbcf7248-8552-458d-b6c9-8aa031c81747', 3);
INSERT INTO supply_chain_purchaseorder (id, code, amount, date, status, items, branch_id, vendor_id) VALUES (7, 'PO-0020', '1700.00', '2026-05-14', 'delivered', '[]', 'e70b410d-d4c3-48d0-a72d-0e7c22c9ab02', 1);
INSERT INTO supply_chain_purchaseorder (id, code, amount, date, status, items, branch_id, vendor_id) VALUES (8, 'PO-0021', '1750.00', '2026-05-14', 'pending', '[]', 'e70b410d-d4c3-48d0-a72d-0e7c22c9ab02', 2);
INSERT INTO supply_chain_purchaseorder (id, code, amount, date, status, items, branch_id, vendor_id) VALUES (9, 'PO-0022', '1800.00', '2026-05-14', 'delivered', '[]', 'e70b410d-d4c3-48d0-a72d-0e7c22c9ab02', 3);
```

### Data for supply_chain_vendor
```sql
INSERT INTO supply_chain_vendor (id, name, contact_person, email, phone, address, categories, lead_time, payment_terms, rating, status, since, on_time_rate, quality_score, fill_rate, avg_response, name_az, tax_number, vendor_code) VALUES (1, 'Dairy Fresh Co', '', 'orders@dairyfresh.az', '', '', '[''Dairy'']', 2, 'Net 30', 4.2, 'Active', '2026-05-14', 0, 0, 0, '—', NULL, NULL, NULL);
INSERT INTO supply_chain_vendor (id, name, contact_person, email, phone, address, categories, lead_time, payment_terms, rating, status, since, on_time_rate, quality_score, fill_rate, avg_response, name_az, tax_number, vendor_code) VALUES (2, 'Produce World', '', 'orders@produceworld.az', '', '', '[''Produce'']', 2, 'Net 30', 3.8, 'Under Review', '2026-05-14', 0, 0, 0, '—', NULL, NULL, NULL);
INSERT INTO supply_chain_vendor (id, name, contact_person, email, phone, address, categories, lead_time, payment_terms, rating, status, since, on_time_rate, quality_score, fill_rate, avg_response, name_az, tax_number, vendor_code) VALUES (3, 'Bakery Supplies AZ', '', 'orders@bakerysupplies.az', '', '', '[''Bakery'']', 2, 'Net 30', 4.5, 'Active', '2026-05-14', 0, 0, 0, '—', NULL, NULL, NULL);
INSERT INTO supply_chain_vendor (id, name, contact_person, email, phone, address, categories, lead_time, payment_terms, rating, status, since, on_time_rate, quality_score, fill_rate, avg_response, name_az, tax_number, vendor_code) VALUES (4, 'BakuFruit LLC', 'Hasan Aliyev', 'orders@bakufruit.az', '+994 12 555 2000', '', '[''Produce'']', 2, 'Net 15', 0.0, 'Active', '2026-05-14', 0, 0, 0, '—', 'BakıMeyvə MMC', 'AZ9876543210', 'V006');
INSERT INTO supply_chain_vendor (id, name, contact_person, email, phone, address, categories, lead_time, payment_terms, rating, status, since, on_time_rate, quality_score, fill_rate, avg_response, name_az, tax_number, vendor_code) VALUES (5, 'Caucasian Meat Prod', 'Rashad Hasanov', 'sales@caucasianmeat.az', '+994 12 555 2001', '', '[''Meat'']', 2, 'Net 30', 0.0, 'Active', '2026-05-14', 0, 0, 0, '—', 'Qafqaz Ət Məhsulları', 'AZ9876543211', 'V007');
```

### Data for tasks_task
```sql
-- No data in tasks_task
```

### Data for waste_management_wasterecord
```sql
INSERT INTO waste_management_wasterecord (id, quantity, reason, notes, logged_at, branch_id, logged_by_id, stock_item_id) VALUES ('ce128939-aae6-4b82-b09c-57863c753813', 8, 'expired', 'Added during automated seeding', '2026-05-14 04:03:03.195400-07:00', '04c4dbd7-3d17-46bb-814d-e7d3111577ac', 1, '8756986f-6585-4814-9f16-b22390901fee');
INSERT INTO waste_management_wasterecord (id, quantity, reason, notes, logged_at, branch_id, logged_by_id, stock_item_id) VALUES ('ddc4a36e-081a-412d-8e59-fe236a1f662d', 5, 'expired', 'Added during automated seeding', '2026-05-14 04:03:03.202496-07:00', '3ea7fb17-2bed-45bb-9162-8946414dcf8d', 1, '6e60e85a-c5ee-4659-a971-0dfddd49e392');
INSERT INTO waste_management_wasterecord (id, quantity, reason, notes, logged_at, branch_id, logged_by_id, stock_item_id) VALUES ('ecb23517-9cd7-4839-8835-05300b828893', 4, 'quality_issues', 'Added during automated seeding', '2026-05-14 04:03:03.203540-07:00', '3ea7fb17-2bed-45bb-9162-8946414dcf8d', 1, '581746dc-10ba-4e9c-952c-37b2ec49bb58');
INSERT INTO waste_management_wasterecord (id, quantity, reason, notes, logged_at, branch_id, logged_by_id, stock_item_id) VALUES ('35af4fb1-d4ef-477c-99c2-35007b9e53e0', 1, 'expired', 'Added during automated seeding', '2026-05-14 04:03:03.204380-07:00', 'ea9e7c28-6f35-4346-b25f-5ddb094f095a', 1, '6c8d43c4-0ecd-4841-81a9-495906f8560b');
INSERT INTO waste_management_wasterecord (id, quantity, reason, notes, logged_at, branch_id, logged_by_id, stock_item_id) VALUES ('d50c3e98-188d-400a-b942-6a0c1d383529', 7, 'damaged', 'Added during automated seeding', '2026-05-14 04:03:03.205416-07:00', '0130b83e-5e0a-4ed6-bc12-4fdc08f46c27', 1, '308c7724-9929-4903-bb37-929b22be4e99');
INSERT INTO waste_management_wasterecord (id, quantity, reason, notes, logged_at, branch_id, logged_by_id, stock_item_id) VALUES ('d7560707-2d40-44c9-972e-16a1eff72b49', 5, 'quality_issues', 'Added during automated seeding', '2026-05-14 04:03:03.206161-07:00', '336c28f2-4d43-4b4f-a659-bb157c5ca432', 1, 'dfdd1f1d-496d-46b9-95bf-92c39cf7c407');
INSERT INTO waste_management_wasterecord (id, quantity, reason, notes, logged_at, branch_id, logged_by_id, stock_item_id) VALUES ('1e5347b7-09c8-428b-86f6-b558a583579f', 2, 'damaged', 'Added during automated seeding', '2026-05-14 04:03:03.206963-07:00', '3ea7fb17-2bed-45bb-9162-8946414dcf8d', 1, '62b1a2df-e5c3-46c9-962c-b959c2c3f7d2');
INSERT INTO waste_management_wasterecord (id, quantity, reason, notes, logged_at, branch_id, logged_by_id, stock_item_id) VALUES ('02c77ecd-1434-4bfb-b58a-13fb6209e046', 2, 'damaged', 'Added during automated seeding', '2026-05-14 04:03:03.207756-07:00', '336c28f2-4d43-4b4f-a659-bb157c5ca432', 1, '1fd83748-e6b9-4899-95e9-ea56c43bd085');
INSERT INTO waste_management_wasterecord (id, quantity, reason, notes, logged_at, branch_id, logged_by_id, stock_item_id) VALUES ('52e3ff2a-8c36-4b2a-8157-9301079d16cf', 6, 'damaged', 'Added during automated seeding', '2026-05-14 04:03:03.208466-07:00', 'ea9e7c28-6f35-4346-b25f-5ddb094f095a', 1, '3f3df9fb-629c-4688-9630-4403b657195f');
INSERT INTO waste_management_wasterecord (id, quantity, reason, notes, logged_at, branch_id, logged_by_id, stock_item_id) VALUES ('35c2a4f8-9e9d-4af4-a8f3-c36f82db828a', 4, 'damaged', 'Added during automated seeding', '2026-05-14 04:03:03.209112-07:00', '0130b83e-5e0a-4ed6-bc12-4fdc08f46c27', 1, 'f1ae2f30-d234-486f-b09b-deef8d6b36aa');
```

### Data for shifts_shift
```sql
-- Initial shifts for staff.downtown@bravoos.az
INSERT INTO shifts_shift (id, start_time, end_time, status, notes, branch_id, user_id) VALUES ('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', '2026-05-14 09:00:00-07:00', '2026-05-14 17:00:00-07:00', 'completed', 'Standard shift', '0130b83e-5e0a-4ed6-bc12-4fdc08f46c27', 6);
```

### Data for shifts_shiftrequest
```sql
-- Sample break request
INSERT INTO shifts_shiftrequest (id, request_type, status, priority, title, description, response, created_at, updated_at, responded_by_id, shift_id, user_id) VALUES ('b2c3d4e5-f6a7-4b8c-9d0e-1f2a3b4c5d6e', 'break', 'approved', 'medium', 'Lunch Break', 'Requesting 30 min lunch', 'Approved', '2026-05-14 12:00:00-07:00', '2026-05-14 12:05:00-07:00', 4, 'a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 6);
```
