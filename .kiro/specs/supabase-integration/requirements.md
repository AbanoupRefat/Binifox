# Requirements Document

## Introduction

This document outlines the requirements for integrating Supabase as the backend database for the Binifox digital agency website. The integration will replace hardcoded data in React components with dynamic data fetched from a PostgreSQL database hosted on Supabase, enabling content management and scalability.

## Glossary

- **Application**: The Next.js-based Binifox digital agency website
- **Supabase Client**: The JavaScript client library that connects the Application to Supabase services
- **Database**: The PostgreSQL database hosted on Supabase
- **Content Entity**: A distinct type of data (Projects, Articles, Services, Team Members, FAQs, Stats, Features)
- **Environment Variables**: Secure configuration values stored in .env.local file
- **Component**: A React component that displays data to users
- **Server Component**: A Next.js component that runs on the server and can directly fetch data
- **Client Component**: A Next.js component that runs in the browser with interactivity

## Requirements

### Requirement 1

**User Story:** As a developer, I want to securely configure Supabase credentials, so that the Application can connect to the Database without exposing sensitive information

#### Acceptance Criteria

1. THE Application SHALL store the Supabase project URL in an environment variable named NEXT_PUBLIC_SUPABASE_URL
2. THE Application SHALL store the Supabase publishable key in an environment variable named NEXT_PUBLIC_SUPABASE_ANON_KEY
3. THE Application SHALL load environment variables from a .env.local file during development
4. THE Application SHALL exclude the .env.local file from version control via .gitignore

### Requirement 2

**User Story:** As a developer, I want to install and configure the Supabase client library, so that Components can communicate with the Database

#### Acceptance Criteria

1. THE Application SHALL include @supabase/supabase-js as a production dependency
2. THE Application SHALL provide a utility function that creates and exports a configured Supabase Client instance
3. THE Supabase Client SHALL use the environment variables for authentication
4. THE utility function SHALL be importable from @/lib/supabase

### Requirement 3

**User Story:** As a content manager, I want a structured Database schema for all content types, so that data can be stored consistently and queried efficiently

#### Acceptance Criteria

1. THE Database SHALL contain a table named "projects" with columns: id, image, title, category, created_at
2. THE Database SHALL contain a table named "articles" with columns: id, image, date, author, comments, title, created_at
3. THE Database SHALL contain a table named "services" with columns: id, icon_name, title, display_order, created_at
4. THE Database SHALL contain a table named "team_members" with columns: id, name, role, image, facebook_url, twitter_url, instagram_url, linkedin_url, created_at
5. THE Database SHALL contain a table named "faqs" with columns: id, question, answer, display_order, created_at
6. THE Database SHALL contain a table named "stats" with columns: id, icon_name, value, label, display_order, created_at
7. THE Database SHALL contain a table named "about_features" with columns: id, icon_name, title, description, display_order, created_at
8. WHEN a new record is inserted into any table, THE Database SHALL automatically populate the created_at column with the current timestamp

### Requirement 4

**User Story:** As a developer, I want to migrate existing hardcoded data to the Database, so that the Application displays the same content after integration

#### Acceptance Criteria

1. THE Database SHALL contain all project records from the Portfolio Component with accurate image URLs, titles, and categories
2. THE Database SHALL contain all article records from the News Component with accurate dates, authors, comment counts, and titles
3. THE Database SHALL contain all service records from the Services Component with accurate icon names and titles
4. THE Database SHALL contain all team member records from the Team Component with accurate names, roles, and image URLs
5. THE Database SHALL contain all FAQ records from the FAQ Component with accurate questions and answers
6. THE Database SHALL contain all stat records from the Stats Component with accurate values and labels
7. THE Database SHALL contain all about feature records from the About Component with accurate titles and descriptions

### Requirement 5

**User Story:** As a user, I want the Portfolio section to display projects from the Database, so that I can see the latest project portfolio

#### Acceptance Criteria

1. WHEN the Portfolio Component renders, THE Application SHALL fetch all project records from the projects table
2. THE Portfolio Component SHALL display each project with its image, title, and category
3. WHEN a user selects a category filter, THE Portfolio Component SHALL display only projects matching that category
4. IF the Database query fails, THE Portfolio Component SHALL display a user-friendly error message

### Requirement 6

**User Story:** As a user, I want the News section to display articles from the Database, so that I can read the latest news and updates

#### Acceptance Criteria

1. WHEN the News Component renders, THE Application SHALL fetch all article records from the articles table ordered by date descending
2. THE News Component SHALL display each article with its image, date, author, comment count, and title
3. IF the Database query fails, THE News Component SHALL display a user-friendly error message

### Requirement 7

**User Story:** As a user, I want the Services section to display services from the Database, so that I can learn about available services

#### Acceptance Criteria

1. WHEN the Services Component renders, THE Application SHALL fetch all service records from the services table ordered by display_order ascending
2. THE Services Component SHALL display each service with its icon and title
3. THE Services Component SHALL map icon_name values to the corresponding Lucide React icon components
4. IF the Database query fails, THE Services Component SHALL display a user-friendly error message

### Requirement 8

**User Story:** As a user, I want the Team section to display team members from the Database, so that I can learn about the team

#### Acceptance Criteria

1. WHEN the Team Component renders, THE Application SHALL fetch all team member records from the team_members table
2. THE Team Component SHALL display each team member with their name, role, image, and social media links
3. THE Team Component SHALL render social media icons only for team members with non-null social media URLs
4. IF the Database query fails, THE Team Component SHALL display a user-friendly error message

### Requirement 9

**User Story:** As a user, I want the FAQ section to display questions from the Database, so that I can find answers to common questions

#### Acceptance Criteria

1. WHEN the FAQ Component renders, THE Application SHALL fetch all FAQ records from the faqs table ordered by display_order ascending
2. THE FAQ Component SHALL display each FAQ with its question and answer
3. THE FAQ Component SHALL maintain its accordion interaction functionality
4. IF the Database query fails, THE FAQ Component SHALL display a user-friendly error message

### Requirement 10

**User Story:** As a user, I want the Stats section to display statistics from the Database, so that I can see current metrics

#### Acceptance Criteria

1. WHEN the Stats Component renders, THE Application SHALL fetch all stat records from the stats table ordered by display_order ascending
2. THE Stats Component SHALL display each stat with its icon, value, and label
3. THE Stats Component SHALL map icon_name values to the corresponding Lucide React icon components
4. THE Stats Component SHALL maintain its counter animation functionality
5. IF the Database query fails, THE Stats Component SHALL display a user-friendly error message

### Requirement 11

**User Story:** As a user, I want the About section to display features from the Database, so that I can learn about company strengths

#### Acceptance Criteria

1. WHEN the About Component renders, THE Application SHALL fetch all about feature records from the about_features table ordered by display_order ascending
2. THE About Component SHALL display each feature with its icon, title, and description
3. THE About Component SHALL map icon_name values to the corresponding Lucide React icon components
4. IF the Database query fails, THE About Component SHALL display a user-friendly error message

### Requirement 12

**User Story:** As a developer, I want proper error handling and loading states, so that users have a good experience even when data is loading or errors occur

#### Acceptance Criteria

1. WHEN a Component is fetching data from the Database, THE Component SHALL display a loading indicator
2. IF a Database query fails, THE Application SHALL log the error details to the console
3. IF a Database query fails, THE Component SHALL display a fallback UI with an appropriate error message
4. THE Application SHALL not crash or display blank screens when Database queries fail
