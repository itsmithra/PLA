-- Seed Subjects
INSERT INTO public.subjects (id, title, slug, description, icon, difficulty_level, estimated_hours) VALUES
('python', 'Python Programming', 'python-programming', 'Master modern Python: syntax, memory model, data structures, OOP, generators, and error handling.', 'FileCode2', 'beginner', 24),
('sql', 'SQL & Relational Databases', 'sql-databases', 'Learn relational data modeling, complex joins, aggregation pipelines, window functions, and indexing strategies.', 'Database', 'intermediate', 20),
('prob-stats', 'Probability & Statistics', 'probability-statistics', 'Core statistical foundations: distributions, Bayes theorem, central limit theorem, hypothesis testing, and confidence intervals.', 'Binary', 'intermediate', 28),
('data-science', 'Data Science Fundamentals', 'data-science-fundamentals', 'End-to-end data pipelines: data cleaning, exploratory data analysis (EDA), feature engineering, and predictive modeling.', 'LineChart', 'intermediate', 32)
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Topics
INSERT INTO public.topics (id, subject_id, title, slug, description, difficulty, order_index, learning_objectives, concept_explanation, worked_example, common_mistakes, practice_questions, prerequisites) VALUES
('py-control-flow', 'python', 'Control Flow, Iterables & Comprehensions', 'control-flow-comprehensions', 'Deep dive into Python iteration protocols, conditional branching, range generators, and list/dict comprehensions.', 'beginner', 1, 
 '["Understand truthiness evaluation and short-circuit boolean logic", "Master the difference between for-in iteration and index-based loops", "Write concise, readable list and dictionary comprehensions"]'::jsonb,
 'In Python, control flow is dominated by iteration over iterable sequences rather than conventional C-style counter increments.',
 '{"problem": "Filter passing scores", "solution": "grades = {s[\"name\"]: \"A\" for s in records if s[\"score\"] >= 60}", "key_steps": ["Filter in if-clause", "Map student name to grade"]}'::jsonb,
 '["Modifying a list while iterating over it", "Overcomplicating comprehensions"]'::jsonb,
 '[]'::jsonb,
 '[]'::jsonb),
('sql-select-filtering', 'sql', 'SQL Query Execution & Filtering Logic', 'query-execution-filtering', 'Logical query processing order, NULL three-valued logic, pattern matching, and conditional aggregation.', 'beginner', 1,
 '["Master the logical query processing order", "Avoid bugs caused by SQL three-valued logic with NULLs", "Use CASE WHEN expressions inside SELECT"]'::jsonb,
 'Unlike procedural languages where code executes sequentially from top to bottom, SQL is declarative and executes in a distinct logical order.',
 '{"problem": "Find high spending customers", "solution": "SELECT customer_id, SUM(amount) FROM orders GROUP BY customer_id HAVING SUM(amount) > 1000;", "key_steps": ["Filter in WHERE", "Group by customer", "Filter aggregate in HAVING"]}'::jsonb,
 '["Attempting to filter aggregates in WHERE clause", "Using non-SARGable predicates"]'::jsonb,
 '[]'::jsonb,
 '[]'::jsonb)
ON CONFLICT (id) DO NOTHING;
