import { Subject, Topic, Question, LearningResource } from "@/types";

export const SEED_SUBJECTS: Subject[] = [
  {
    id: "python",
    title: "Python Programming",
    slug: "python-programming",
    description: "Master modern Python: syntax, memory model, data structures, OOP, generators, and error handling.",
    icon: "FileCode2",
    difficulty_level: "beginner",
    estimated_hours: 24,
    total_topics: 4,
    mastery_percentage: 0,
  },
  {
    id: "sql",
    title: "SQL & Relational Databases",
    slug: "sql-databases",
    description: "Learn relational data modeling, complex joins, aggregation pipelines, window functions, and indexing strategies.",
    icon: "Database",
    difficulty_level: "intermediate",
    estimated_hours: 20,
    total_topics: 4,
    mastery_percentage: 0,
  },
  {
    id: "prob-stats",
    title: "Probability & Statistics",
    slug: "probability-statistics",
    description: "Core statistical foundations: distributions, Bayes theorem, central limit theorem, hypothesis testing, and confidence intervals.",
    icon: "Binary",
    difficulty_level: "intermediate",
    estimated_hours: 28,
    total_topics: 4,
    mastery_percentage: 0,
  },
  {
    id: "data-science",
    title: "Data Science Fundamentals",
    slug: "data-science-fundamentals",
    description: "End-to-end data pipelines: data cleaning, exploratory data analysis (EDA), feature engineering, and predictive modeling.",
    icon: "LineChart",
    difficulty_level: "intermediate",
    estimated_hours: 32,
    total_topics: 4,
    mastery_percentage: 0,
  },
];

export const SEED_TOPICS: Topic[] = [
  // ----------------- PYTHON TOPICS -----------------
  {
    id: "py-control-flow",
    subject_id: "python",
    title: "Control Flow, Iterables & Comprehensions",
    slug: "control-flow-comprehensions",
    description: "Deep dive into Python iteration protocols, conditional branching, range generators, and list/dict comprehensions.",
    difficulty: "beginner",
    order_index: 1,
    learning_objectives: [
      "Understand truthiness evaluation and short-circuit boolean logic",
      "Master the difference between for-in iteration and index-based loops",
      "Write concise, readable list and dictionary comprehensions without memory blowups",
      "Utilize enumerate() and zip() idiomatic iteration tools",
    ],
    concept_explanation: `In Python, control flow is dominated by iteration over iterable sequences rather than conventional C-style counter increments. 

Key concepts:
1. Short-circuit Evaluation: In 'A and B', if A is false, Python never evaluates B. In 'A or B', if A is true, B is skipped.
2. The Iteration Protocol: An object is iterable if it implements '__iter__()' or '__getitem__()'. The 'for item in collection:' construct requests an iterator via iter() and repeatedly calls next() until StopIteration is raised.
3. Comprehensions: '[expr for item in iterable if condition]' constructs a new list in a single, C-optimized bytecode step. It replaces verbose append loops and produces cleaner functional syntax.
4. Dict Comprehensions: '{k: v for k, v in pairs}' allows expressive mapping transformations in O(N) linear time.`,
    worked_example: {
      problem: "Given a list of student records [{'name': 'Maya', 'score': 88}, {'name': 'Alex', 'score': 54}, {'name': 'Priya', 'score': 95}], construct a dictionary mapping names of passing students (score >= 60) to a letter grade ('A' for >= 90, otherwise 'B').",
      solution: `records = [
    {'name': 'Maya', 'score': 88},
    {'name': 'Alex', 'score': 54},
    {'name': 'Priya', 'score': 95}
]

grades = {
    student['name']: ('A' if student['score'] >= 90 else 'B')
    for student in records
    if student['score'] >= 60
}

# Result: {'Maya': 'B', 'Priya': 'A'}`,
      key_steps: [
        "Filter students where student['score'] >= 60 in the comprehension's if-clause.",
        "Use a ternary expression 'A' if score >= 90 else 'B' for dictionary value evaluation.",
        "Key assigned as student['name']. Alex is excluded without mutating the input list.",
      ],
    },
    common_mistakes: [
      "Modifying a list while iterating over it (causes skipped elements). Use a comprehension or list slice copy instead.",
      "Overcomplicating comprehensions with nested loops and multiple clauses; when comprehensions span > 2 lines, refactor to a standard generator or function for readability.",
      "Using 'is' instead of '==' for value equality (e.g. comparing numbers or strings instead of identity with None).",
    ],
    practice_questions: [
      {
        prompt: "How does Python evaluate '[] or {} or 0 or [1, 2] or 'hello''?",
        hint: "Recall truthiness rules: empty collections and 0 evaluate to falsy.",
        sample_answer: "It evaluates to [1, 2]. Python short-circuits at the first truthy value encountered.",
      },
      {
        prompt: "Write a one-line list comprehension that extracts all unique even numbers squared from numbers = [1, 2, 2, 3, 4, 4, 5].",
        hint: "Use set comprehension to guarantee uniqueness first.",
        sample_answer: "list({x**2 for x in numbers if x % 2 == 0}) -> [4, 16]",
      },
    ],
    prerequisites: [],
    related_topics: ["py-functions-scope", "py-data-structures"],
  },
  {
    id: "py-functions-scope",
    subject_id: "python",
    title: "Functions, Closures & Decorators",
    slug: "functions-closures-decorators",
    description: "First-class functions, LEGB variable scoping, default argument mutability traps, closures, and metaprogramming decorators.",
    difficulty: "intermediate",
    order_index: 2,
    learning_objectives: [
      "Understand the LEGB (Local, Enclosing, Global, Built-in) lookup hierarchy",
      "Avoid the dangerous mutable default argument bug (e.g. def func(x=[]))",
      "Construct closures that preserve lexical state across invocations",
      "Write wrapper decorators with functools.wraps for telemetry and validation",
    ],
    concept_explanation: `Functions in Python are first-class citizens: they can be passed as arguments, assigned to variables, returned from other functions, and stored in data structures.

1. Variable Resolution (LEGB):
When referencing a variable inside a function, Python searches in order:
- Local (inside the current function)
- Enclosing (inside outer enclosing functions in nested scenarios)
- Global (module-level)
- Built-in (Python builtins like len, range, str)

2. The Mutable Default Trap:
Default arguments are evaluated once when the function definition is executed, NOT at invocation time. Writing 'def append_to(item, target=[])' causes all default calls to share the exact same list instance in memory. Always use 'target=None' and assign inside the function.

3. Decorators:
A decorator is a callable that accepts a function and returns an enhanced function. Using @functools.wraps ensures docstrings, names, and signature metadata are preserved.`,
    worked_example: {
      problem: "Implement a timing decorator '@timer' that records execution duration and prints the function name and elapsed milliseconds.",
      solution: `import time
from functools import wraps

def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed_ms = (time.perf_counter() - start_time) * 1000
        print(f"[{func.__name__}] executed in {elapsed_ms:.2f}ms")
        return result
    return wrapper

@timer
def compute_factorials(n):
    return [i * i for i in range(n)]`,
      key_steps: [
        "Define decorator accepting the target callable 'func'.",
        "Decorate the inner wrapper with '@wraps(func)' to keep function name and docstrings intact.",
        "Capture start time using time.perf_counter() for high-resolution timing.",
        "Invoke func(*args, **kwargs), record end time, compute delta, and return the original result.",
      ],
    },
    common_mistakes: [
      "Forgetting to return the result of func(*args, **kwargs) in the decorator wrapper, returning None inadvertently.",
      "Omitting '@wraps(func)', which changes func.__name__ to 'wrapper' and breaks debugging and serialization.",
      "Rebinding outer variables without 'nonlocal' inside an enclosing closure.",
    ],
    practice_questions: [
      {
        prompt: "Why does 'def add_item(item, lst=[]): lst.append(item); return lst' return [1, 2] on the second call 'add_item(2)'?",
        hint: "Consider when default parameters are evaluated in the Python compiler.",
        sample_answer: "Default argument 'lst' is evaluated once at module load time. Both calls reference the identical list object in memory.",
      },
    ],
    prerequisites: ["py-control-flow"],
    related_topics: ["py-oop"],
  },
  {
    id: "py-data-structures",
    subject_id: "python",
    title: "Built-in Data Structures & Complexity",
    slug: "data-structures-complexity",
    description: "Time & space complexity of lists, tuples, sets, dicts, deques, and heaps in CPython.",
    difficulty: "intermediate",
    order_index: 3,
    learning_objectives: [
      "Analyze Big-O time complexity for common list vs set operations",
      "Understand hash tables, collisions, and hashable type requirements",
      "Use collections.defaultdict, Counter, and deque appropriately",
      "Implement priority queues using the heapq module",
    ],
    concept_explanation: `CPython relies on carefully engineered C structures:
- Lists: Dynamic arrays with geometric over-allocation. Random access is O(1). Appending to the end is amortized O(1). Inserting or deleting at index 0 requires shifting N elements, making it O(N).
- Deques ('collections.deque'): Doubly-linked lists of fixed-size blocks. O(1) appends and pops from both ends.
- Dictionaries: Compact hash tables since Python 3.6 that preserve insertion order. Key lookups, inserts, and deletes are average O(1) amortized. Keys must be hashable (__hash__ and __eq__).
- Sets: Hash tables storing keys only. Membership tests ('item in my_set') are O(1) average vs O(N) for lists.`,
    worked_example: {
      problem: "Find the top 2 most frequent words in a text corpus, breaking ties alphabetically, in linear time.",
      solution: `from collections import Counter

def top_frequent_words(words, k=2):
    counts = Counter(words)
    # Sort primarily by frequency descending (-count), secondarily by word ascending
    sorted_words = sorted(counts.keys(), key=lambda w: (-counts[w], w))
    return sorted_words[:k]

# Example:
text = ["apple", "banana", "apple", "cherry", "banana", "banana"]
# Output: ['banana', 'apple']`,
      key_steps: [
        "Use collections.Counter to count occurrences in O(N) time.",
        "Sort keys with a composite tuple key (-counts[w], w) to guarantee proper tie-breaking.",
        "Slice the top k elements.",
      ],
    },
    common_mistakes: [
      "Performing 'x in list' repeatedly inside a loop, turning an O(N) task into an O(N^2) quadratic disaster. Convert to a set first.",
      "Attempting to use a mutable list as a dictionary key or set element (triggers TypeError: unhashable type: 'list').",
    ],
    practice_questions: [
      {
        prompt: "What is the time complexity of 'my_list.pop(0)' vs 'my_deque.popleft()'?",
        hint: "Dynamic array index shifting vs double ended queue pointer adjustment.",
        sample_answer: "my_list.pop(0) is O(N) because all remaining elements shift left; my_deque.popleft() is O(1).",
      },
    ],
    prerequisites: ["py-control-flow"],
    related_topics: ["py-oop"],
  },
  {
    id: "py-oop",
    subject_id: "python",
    title: "Object-Oriented Design & Dunder Methods",
    slug: "oop-dunder-methods",
    description: "Classes, inheritance, method resolution order (MRO), dataclasses, and magic dunder methods (__repr__, __eq__, __len__).",
    difficulty: "advanced",
    order_index: 4,
    learning_objectives: [
      "Design clean object models utilizing Pythonic properties and encapsulation",
      "Master Method Resolution Order (MRO) in multiple inheritance with C3 linearization",
      "Leverage @dataclass for boilerplate-free data structures",
      "Implement magic dunder methods for custom container and arithmetic behavior",
    ],
    concept_explanation: `Python's OOP model is flexible and relies on conventions and protocols rather than rigid access modifiers:
- Special Methods (Dunder Methods): Methods prefixed and suffixed with double underscores allow user classes to integrate seamlessly with built-in functions:
  * '__repr__': Developer-facing representation
  * '__str__': User-facing string representation
  * '__eq__': Equality checking
  * '__len__': Supports len(obj)
  * '__iter__': Enables 'for x in obj'
- Properties: Use '@property' to expose attributes cleanly while retaining the option to add validation later without breaking client code.
- Dataclasses: Introduced in Python 3.7 ('@dataclass'), automatically generates '__init__', '__repr__', and comparison methods based on type annotations.`,
    worked_example: {
      problem: "Create an immutable 2D Vector dataclass supporting addition, scaling by a scalar, and magnitude calculation.",
      solution: `import math
from dataclasses import dataclass

@dataclass(frozen=True)
class Vector2D:
    x: float
    y: float

    def __add__(self, other: "Vector2D") -> "Vector2D":
        if not isinstance(other, Vector2D):
            return NotImplemented
        return Vector2D(self.x + other.x, self.y + other.y)

    def __mul__(self, scalar: float) -> "Vector2D":
        return Vector2D(self.x * scalar, self.y * scalar)

    @property
    def magnitude(self) -> float:
        return math.hypot(self.x, self.y)

# Example:
v1 = Vector2D(3.0, 4.0)
v2 = Vector2D(1.0, 2.0)
v3 = v1 + v2 # Vector2D(x=4.0, y=6.0)
mag = v1.magnitude # 5.0`,
      key_steps: [
        "Use '@dataclass(frozen=True)' to enforce immutability and auto-generate __eq__ and __hash__.",
        "Implement '__add__' to support the '+' operator, returning a fresh Vector2D instance.",
        "Return 'NotImplemented' if other operand type is incompatible so Python can check reverse operators.",
        "Provide '@property def magnitude' calculated on demand via math.hypot.",
      ],
    },
    common_mistakes: [
      "Overusing multiple inheritance when composition or interfaces are clearer.",
      "Returning True from __eq__ without verifying 'isinstance(other, MyClass)', leading to runtime attribute errors.",
    ],
    practice_questions: [
      {
        prompt: "What is the difference between __repr__ and __str__?",
        hint: "Consider the intended audience: developers debugging vs end users.",
        sample_answer: "__repr__ aims to be unambiguous and evaluable (ideally code recreating the object for developers), while __str__ aims to be readable for end users.",
      },
    ],
    prerequisites: ["py-functions-scope", "py-data-structures"],
    related_topics: [],
  },

  // ----------------- SQL TOPICS -----------------
  {
    id: "sql-select-filtering",
    subject_id: "sql",
    title: "SQL Query Execution & Filtering Logic",
    slug: "query-execution-filtering",
    description: "Logical query processing order, NULL three-valued logic, pattern matching, and conditional aggregation.",
    difficulty: "beginner",
    order_index: 1,
    learning_objectives: [
      "Master the logical query processing order (FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY)",
      "Avoid bugs caused by SQL three-valued logic (TRUE, FALSE, UNKNOWN) with NULLs",
      "Use CASE WHEN expressions inside SELECT and aggregate functions",
      "Write efficient predicate filters that allow database engine index usage (SARGability)",
    ],
    concept_explanation: `Unlike procedural languages where code executes sequentially from top to bottom, SQL is declarative and executes in a distinct logical order:
1. FROM / JOINs: Locate and combine data sources.
2. WHERE: Row-level filters applied before grouping.
3. GROUP BY: Aggregate rows into groups.
4. HAVING: Group-level filters applied after grouping.
5. SELECT: Project expressions, compute aliases, and evaluate window functions.
6. DISTINCT: Remove duplicate projected rows.
7. ORDER BY: Sort final records.
8. LIMIT / OFFSET: Constrain output row count.

Crucial Pitfall - Three-Valued Logic:
In SQL, 'NULL = NULL' evaluates to UNKNOWN, not TRUE. Expressions like 'WHERE column != 'active'' will silently drop rows where column is NULL. You must use 'IS NULL' or 'IS NOT NULL' or 'COALESCE()'.`,
    worked_example: {
      problem: "From a table 'orders(id, customer_id, amount, status, created_at)', find customer IDs who spent more than $1000 in 'completed' orders during 2024, sorted by total spend descending.",
      solution: `SELECT 
    customer_id,
    SUM(amount) AS total_spent,
    COUNT(id) AS completed_orders_count
FROM orders
WHERE status = 'completed'
  AND created_at >= '2024-01-01'
  AND created_at < '2025-01-01'
GROUP BY customer_id
HAVING SUM(amount) > 1000
ORDER BY total_spent DESC;`,
      key_steps: [
        "Filter row-level predicates in WHERE before any grouping (ensures index on created_at can be used).",
        "Group rows by customer_id.",
        "Use HAVING to filter aggregated amounts (> 1000) because WHERE cannot inspect aggregate expressions.",
        "Sort results by total_spent descending.",
      ],
    },
    common_mistakes: [
      "Attempting to filter aggregates in WHERE (e.g. 'WHERE SUM(amount) > 1000' throws syntax error). Always use HAVING.",
      "Using non-SARGable predicates like 'WHERE YEAR(created_at) = 2024', which prevents index seeks. Use date bounds '>= 2024-01-01 AND < 2025-01-01'.",
      "Using 'NOT IN (SELECT id FROM ...)' when the subquery might return a NULL; in SQL, if the subquery contains a NULL, NOT IN returns no rows!",
    ],
    practice_questions: [
      {
        prompt: "Why does 'SELECT * FROM users WHERE status != 'banned'' exclude users whose status is NULL?",
        hint: "Three-valued logic: NULL != 'banned' evaluates to UNKNOWN.",
        sample_answer: "WHERE only returns rows where the condition is TRUE. UNKNOWN is discarded, so rows with NULL status are excluded.",
      },
    ],
    prerequisites: [],
    related_topics: ["sql-joins-relationships", "sql-aggregations"],
  },
  {
    id: "sql-joins-relationships",
    subject_id: "sql",
    title: "Relational JOINs & Cardinality",
    slug: "relational-joins-cardinality",
    description: "INNER, LEFT, RIGHT, FULL, and CROSS joins, foreign key integrity, Cartesian explosion, and self-joins.",
    difficulty: "intermediate",
    order_index: 2,
    learning_objectives: [
      "Select the correct JOIN type based on relational cardinality (1:1, 1:N, M:N)",
      "Prevent accidental Cartesian products and row duplication during multi-table joins",
      "Understand the difference between filtering in the ON clause vs the WHERE clause of a LEFT JOIN",
      "Utilize self-joins for hierarchical tree structures (e.g. employees and managers)",
    ],
    concept_explanation: `Relational joins synthesize tables based on related keys:
- INNER JOIN: Keeps only rows where the join predicate matches in both tables.
- LEFT (OUTER) JOIN: Preserves all rows from the left table; matches from the right table are included, or populated with NULL if no match exists.
- FULL OUTER JOIN: Preserves all rows from both tables, filling mismatches with NULL.
- CROSS JOIN: Produces the Cartesian product (M * N rows).

Critical Difference: ON vs WHERE in a LEFT JOIN:
- Predicates in the ON clause filter the right table BEFORE joining. Left table rows are still returned.
- Predicates in the WHERE clause filter the resulting rows AFTER joining. Placing a condition on the right table in WHERE (e.g. 'WHERE right_table.active = true') converts the query into an INNER JOIN because NULLs are filtered out!`,
    worked_example: {
      problem: "Find all customers who have NEVER placed an order, including their registration date.",
      solution: `SELECT 
    c.id AS customer_id,
    c.name,
    c.created_at AS registered_at
FROM customers c
LEFT JOIN orders o 
    ON c.id = o.customer_id
WHERE o.id IS NULL;`,
      key_steps: [
        "Perform a LEFT JOIN from customers to orders so every customer is preserved.",
        "Check 'WHERE o.id IS NULL' to isolate customers that have no matching row in orders.",
        "This anti-join pattern is highly optimized in PostgreSQL and modern SQL engines.",
      ],
    },
    common_mistakes: [
      "Joining multiple one-to-many tables in a single query without sub-aggregations, causing row multiplication and inflated SUMs.",
      "Omitting join condition predicates, accidentally triggering an expensive Cartesian CROSS JOIN.",
    ],
    practice_questions: [
      {
        prompt: "If Table A has 5 rows and Table B has 4 rows, how many rows will 'SELECT * FROM A CROSS JOIN B' return?",
        hint: "Cartesian product multiplies counts.",
        sample_answer: "20 rows (5 * 4 = 20).",
      },
    ],
    prerequisites: ["sql-select-filtering"],
    related_topics: ["sql-aggregations", "sql-window-functions"],
  },
  {
    id: "sql-aggregations",
    subject_id: "sql",
    title: "Aggregations, Grouping & Rollups",
    slug: "aggregations-grouping-rollups",
    description: "Aggregation functions, GROUP BY semantics, GROUPING SETS, CUBE, and ROLLUP for reporting.",
    difficulty: "intermediate",
    order_index: 3,
    learning_objectives: [
      "Differentiate between COUNT(*) and COUNT(column_name)",
      "Use GROUP BY with multiple dimensions cleanly",
      "Employ conditional aggregation (SUM(CASE WHEN ...)) to pivot tabular data",
      "Generate hierarchical subtotals using ROLLUP and GROUPING SETS",
    ],
    concept_explanation: `Aggregation collapses sets of rows into summary values.
- COUNT(*) counts every row in the partition, regardless of NULLs.
- COUNT(column_name) counts only non-NULL entries in that column.
- Conditional Aggregation: Rather than running multiple queries or complex subqueries, SQL allows embedding CASE expressions within aggregates:
  'SUM(CASE WHEN status = 'shipped' THEN 1 ELSE 0 END)'
This is the standard, cross-database pattern for pivoting rows into columns.`,
    worked_example: {
      problem: "Compute total sales, completed order count, and refunded order count by product category in a single query.",
      solution: `SELECT 
    p.category,
    COUNT(o.id) AS total_orders,
    SUM(o.amount) AS total_revenue,
    SUM(CASE WHEN o.status = 'completed' THEN o.amount ELSE 0 END) AS completed_revenue,
    SUM(CASE WHEN o.status = 'refunded' THEN 1 ELSE 0 END) AS refunded_count
FROM products p
JOIN orders o ON p.id = o.product_id
GROUP BY p.category
ORDER BY total_revenue DESC;`,
      key_steps: [
        "Join products with orders on product_id.",
        "Group by category.",
        "Use standard SUM(amount) for overall category revenue.",
        "Use conditional CASE expressions inside SUM to calculate selective metrics without separate queries.",
      ],
    },
    common_mistakes: [
      "Selecting non-aggregated columns that are not included in the GROUP BY clause (violates ANSI SQL and causes errors in standard Postgres).",
      "Confusing COUNT(col) with COUNT(*), leading to missed rows when column contains NULLs.",
    ],
    practice_questions: [
      {
        prompt: "If a column 'score' has values [10, 20, NULL, 30], what does 'AVG(score)' return?",
        hint: "Standard SQL aggregate functions ignore NULLs.",
        sample_answer: "20. AVG ignores NULL and calculates (10 + 20 + 30) / 3 = 20.",
      },
    ],
    prerequisites: ["sql-joins-relationships"],
    related_topics: ["sql-window-functions"],
  },
  {
    id: "sql-window-functions",
    subject_id: "sql",
    title: "Window Functions & Analytical Queries",
    slug: "window-functions-analytics",
    description: "ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD, running totals with OVER (PARTITION BY ... ORDER BY ...).",
    difficulty: "advanced",
    order_index: 4,
    learning_objectives: [
      "Understand the difference between GROUP BY aggregation and windowing calculations",
      "Differentiate between ROW_NUMBER(), RANK(), and DENSE_RANK()",
      "Calculate time-series moving averages and month-over-month growth using LAG() and LEAD()",
      "Configure explicit window framing (ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)",
    ],
    concept_explanation: `Unlike GROUP BY which collapses multiple rows into a single row, Window Functions perform calculations across a set of table rows that are related to the current row, preserving individual row identities.

Syntax:
'<function>() OVER (PARTITION BY partition_col ORDER BY sort_col ROWS frame_spec)'

Key Functions:
- ROW_NUMBER(): Assigns sequential integers starting from 1 with no ties.
- RANK(): Assigns rank; ties get the same rank, and subsequent ranks are skipped (1, 2, 2, 4).
- DENSE_RANK(): Assigns rank with ties, but does not skip any ranks (1, 2, 2, 3).
- LAG(col, n) / LEAD(col, n): Accesses values from previous or following rows without self-joins.`,
    worked_example: {
      problem: "For each user, find their top 3 highest spending orders and calculate the difference in spending between their current order and their previous order.",
      solution: `WITH RankedOrders AS (
    SELECT 
        id,
        user_id,
        amount,
        created_at,
        ROW_NUMBER() OVER (
            PARTITION BY user_id 
            ORDER BY amount DESC
        ) AS spend_rank,
        LAG(amount) OVER (
            PARTITION BY user_id 
            ORDER BY created_at ASC
        ) AS prev_order_amount
    FROM orders
)
SELECT 
    id,
    user_id,
    amount,
    spend_rank,
    (amount - prev_order_amount) AS spend_delta_from_prev
FROM RankedOrders
WHERE spend_rank <= 3;`,
      key_steps: [
        "Create a CTE (Common Table Expression) to compute window metrics.",
        "Calculate 'spend_rank' partitioning by user_id and ordering by amount descending.",
        "Calculate 'prev_order_amount' using LAG() ordered chronologically by created_at.",
        "Filter for top 3 in outer query (window functions cannot be evaluated directly in WHERE).",
      ],
    },
    common_mistakes: [
      "Attempting to use a window function inside a WHERE or HAVING clause (they execute after WHERE and HAVING in logical query order; use a CTE or subquery).",
      "Omitting 'ORDER BY' in a cumulative SUM, which causes the SUM to compute over the entire partition instead of a running total.",
    ],
    practice_questions: [
      {
        prompt: "What is the difference between RANK() and DENSE_RANK() when two values tie for 1st place?",
        hint: "Check what happens to the 3rd item.",
        sample_answer: "RANK() assigns (1, 1, 3) skipping 2; DENSE_RANK() assigns (1, 1, 2) without skipping.",
      },
    ],
    prerequisites: ["sql-aggregations"],
    related_topics: [],
  },

  // ----------------- PROBABILITY & STATISTICS -----------------
  {
    id: "stats-descriptive",
    subject_id: "prob-stats",
    title: "Descriptive Statistics, Variance & Skewness",
    slug: "descriptive-stats-variance-skewness",
    description: "Central tendency (mean, median, mode), spread (variance, standard deviation, IQR), outliers, and distribution shape.",
    difficulty: "beginner",
    order_index: 1,
    learning_objectives: [
      "Select robust measures of central tendency when dealing with skewed data",
      "Understand Bessel's correction (N-1) in sample variance calculations",
      "Detect outliers systematically using the Interquartile Range (IQR) rule",
      "Interpret positive and negative skewness and their impact on ML algorithms",
    ],
    concept_explanation: `Descriptive statistics summarize the characteristics of a dataset:
1. Central Tendency:
- Mean: Sensitive to extreme outliers.
- Median: The 50th percentile; robust against outliers and heavily skewed distributions.
- Mode: Most frequent observation, useful for categorical data.

2. Spread:
- Sample Variance: s^2 = sum((x_i - mean)^2) / (n - 1). The 'n - 1' divisor (Bessel's correction) corrects for negative bias in sample estimation.
- Standard Deviation: s = sqrt(variance), expressed in original units.
- IQR: Q3 - Q1. An observation is traditionally an outlier if it lies beyond Q1 - 1.5*IQR or Q3 + 1.5*IQR.

3. Skewness:
- Right (positive) skew: Long right tail. Mean > Median > Mode. Common in income, housing prices.
- Left (negative) skew: Long left tail. Mean < Median < Mode.`,
    worked_example: {
      problem: "Given salary data in thousands: [30, 32, 35, 38, 40, 42, 45, 180]. Calculate the median, identify if 180 is an IQR outlier, and explain why median is preferred over mean.",
      solution: `Data sorted: [30, 32, 35, 38, 40, 42, 45, 180] (N = 8)
- Mean = (442) / 8 = 55.25k
- Median = (38 + 40) / 2 = 39.0k
- Q1 (median of lower half [30, 32, 35, 38]) = (32 + 35) / 2 = 33.5k
- Q3 (median of upper half [40, 42, 45, 180]) = (42 + 45) / 2 = 43.5k
- IQR = Q3 - Q1 = 43.5 - 33.5 = 10.0k
- Upper Fence = Q3 + 1.5 * IQR = 43.5 + 15 = 58.5k

Since 180k > 58.5k, 180k is an extreme outlier. 
The mean (55.25k) is higher than 87.5% of all employees due to one outlier. The median (39k) faithfully reflects the typical salary.`,
      key_steps: [
        "Sort data and locate the 50th percentile (median).",
        "Compute Q1 and Q3, then obtain IQR = Q3 - Q1.",
        "Calculate outer threshold (Q3 + 1.5*IQR) and evaluate outlier status.",
      ],
    },
    common_mistakes: [
      "Dividing by N instead of N - 1 when computing sample variance.",
      "Reporting only the mean for highly skewed datasets without variance or median.",
    ],
    practice_questions: [
      {
        prompt: "If a distribution has Mean = 45 and Median = 60, what is the direction of skew?",
        hint: "The tail pulls the mean.",
        sample_answer: "Negative (left) skew, because extreme low values pull the mean below the median.",
      },
    ],
    prerequisites: [],
    related_topics: ["stats-probability-rules"],
  },
  {
    id: "stats-probability-rules",
    subject_id: "prob-stats",
    title: "Probability Rules & Bayes' Theorem",
    slug: "probability-rules-bayes-theorem",
    description: "Independence, conditional probability, law of total probability, and Bayesian updating.",
    difficulty: "intermediate",
    order_index: 2,
    learning_objectives: [
      "Calculate conditional probability P(A|B) = P(A and B) / P(B)",
      "Distinguish between mutually exclusive events and independent events",
      "Apply the Law of Total Probability to partition sample spaces",
      "Formulate Bayes' Theorem: P(A|B) = [P(B|A) * P(A)] / P(B) to update beliefs with evidence",
    ],
    concept_explanation: `Foundations of Probability:
1. Addition Rule: P(A or B) = P(A) + P(B) - P(A and B). If mutually exclusive, P(A and B) = 0.
2. Multiplication Rule: P(A and B) = P(A) * P(B|A). If independent, P(B|A) = P(B), so P(A and B) = P(A) * P(B).
3. Bayes' Theorem:
Enables rational belief updating in the presence of noisy evidence:
P(Hypothesis | Evidence) = [P(Evidence | Hypothesis) * P(Hypothesis)] / P(Evidence)

Where:
- P(Hypothesis): Prior probability before observing evidence.
- P(Evidence | Hypothesis): Likelihood.
- P(Evidence): Marginal probability of the evidence across all hypotheses.
- P(Hypothesis | Evidence): Posterior probability.`,
    worked_example: {
      problem: "A medical test has 99% sensitivity (detects disease if present) and 95% specificity (negative if healthy). The rare disease prevalence is 1% (0.01). If a patient tests positive, what is the probability they actually have the disease?",
      solution: `Given:
- P(D) = 0.01 (Disease prior)
- P(not D) = 0.99 (Healthy prior)
- P(+ | D) = 0.99 (Sensitivity)
- P(- | not D) = 0.95 (Specificity) => P(+ | not D) = 0.05 (False Positive Rate)

Step 1: Compute total probability of testing positive P(+):
P(+) = P(+ | D)*P(D) + P(+ | not D)*P(not D)
P(+) = (0.99 * 0.01) + (0.05 * 0.99)
P(+) = 0.0099 + 0.0495 = 0.0594

Step 2: Apply Bayes' Theorem:
P(D | +) = [P(+ | D) * P(D)] / P(+)
P(D | +) = 0.0099 / 0.0594 ≈ 0.1667 (16.7%)

Conclusion: Despite 99% test accuracy, a positive test result means only a 16.7% chance of having the disease due to the low base rate!`,
      key_steps: [
        "Identify Prior, Sensitivity, and False Positive Rate.",
        "Calculate Marginal Evidence P(+) using the Law of Total Probability.",
        "Divide joint true positive probability by total positive probability.",
      ],
    },
    common_mistakes: [
      "Base Rate Fallacy: Assuming test sensitivity (99%) equals the probability of having the disease given a positive test.",
      "Confusing P(A|B) with P(B|A).",
    ],
    practice_questions: [
      {
        prompt: "Can two non-trivial events (P(A) > 0, P(B) > 0) be both mutually exclusive and independent?",
        hint: "If mutually exclusive, does knowing A occurred give information about B?",
        sample_answer: "No. If they are mutually exclusive, P(A and B) = 0. If independent, P(A and B) = P(A)*P(B) > 0. A contradiction.",
      },
    ],
    prerequisites: ["stats-descriptive"],
    related_topics: ["stats-distributions"],
  },
  {
    id: "stats-distributions",
    subject_id: "prob-stats",
    title: "Distributions & Central Limit Theorem",
    slug: "distributions-central-limit-theorem",
    description: "Binomial, Poisson, Normal distributions, z-scores, and why the Central Limit Theorem powers modern inference.",
    difficulty: "intermediate",
    order_index: 3,
    learning_objectives: [
      "Select appropriate probability distributions for discrete vs continuous data",
      "Calculate standard normal z-scores and empirical rule probabilities (68-95-99.7)",
      "Explain the Central Limit Theorem and its conditions",
      "Apply CLT to determine sample size requirements for reliable estimation",
    ],
    concept_explanation: `Distributions model how probabilities are assigned across random variables:
1. Discrete Distributions:
- Binomial: Number of successes k in n independent Bernoulli trials with probability p.
- Poisson: Number of rare independent events occurring in a fixed interval of time or space with rate lambda.

2. Continuous Distributions:
- Normal (Gaussian): Defined by mean mu and variance sigma^2. Symmetrical, bell-shaped.
- Standard Normal (Z): mu = 0, sigma = 1. z = (X - mu) / sigma.

3. The Central Limit Theorem (CLT):
Regardless of the underlying population distribution (uniform, exponential, bimodal, etc.), the distribution of the sample mean (X_bar) of n independent observations approaches a Normal distribution as n grows large (typically n >= 30):
X_bar ~ N(mu, sigma^2 / n)
The standard error of the mean is SE = sigma / sqrt(n).`,
    worked_example: {
      problem: "A battery manufacturer claims their batteries last an average of 500 hours with standard deviation 40 hours. If a quality control engineer tests a random sample of 64 batteries, what is the probability that the sample mean lifetime is less than 490 hours?",
      solution: `Given:
Population Mean mu = 500
Population Standard Deviation sigma = 40
Sample size n = 64 (n >= 30, CLT applies)

Step 1: Calculate Standard Error (SE) of the sample mean:
SE = sigma / sqrt(n) = 40 / sqrt(64) = 40 / 8 = 5.0 hours

Step 2: Calculate the z-score for X_bar = 490:
z = (490 - 500) / SE = -10 / 5.0 = -2.00

Step 3: Look up standard normal CDF for z = -2.00:
P(Z < -2.00) ≈ 0.0228 (2.28%)

Conclusion: There is only a 2.28% chance that a random sample of 64 batteries would have a mean below 490 hours if the manufacturer's claim is true.`,
      key_steps: [
        "Verify CLT conditions (n = 64 >= 30).",
        "Compute standard error SE = sigma / sqrt(n).",
        "Calculate sample z-score and evaluate probability under standard normal curve.",
      ],
    },
    common_mistakes: [
      "Using standard deviation sigma instead of standard error SE when evaluating sample means.",
      "Thinking the population distribution becomes normal as sample size increases (only the distribution of the sample mean becomes normal).",
    ],
    practice_questions: [
      {
        prompt: "By how much does the standard error decrease if you quadruple the sample size from n=25 to n=100?",
        hint: "SE contains sqrt(n) in the denominator.",
        sample_answer: "It is halved: 1 / sqrt(100) = 1/10 vs 1 / sqrt(25) = 1/5.",
      },
    ],
    prerequisites: ["stats-probability-rules"],
    related_topics: ["stats-hypothesis-testing"],
  },
  {
    id: "stats-hypothesis-testing",
    subject_id: "prob-stats",
    title: "Hypothesis Testing & Confidence Intervals",
    slug: "hypothesis-testing-confidence-intervals",
    description: "Null & alternative hypotheses, Type I/II errors, p-values, t-tests, and constructing confidence intervals.",
    difficulty: "advanced",
    order_index: 4,
    learning_objectives: [
      "Formulate null (H0) and alternative (Ha) hypotheses correctly",
      "Differentiate between Type I error (alpha) and Type II error (beta) and statistical power (1 - beta)",
      "Interpret p-values precisely without common misinterpretations",
      "Construct 95% confidence intervals and conduct two-sample t-tests",
    ],
    concept_explanation: `Statistical inference tests hypotheses against empirical data:
1. Hypothesis Formulation:
- Null Hypothesis (H0): Baseline assumption of no effect, no difference, or status quo.
- Alternative Hypothesis (Ha): Claim being tested (directional or two-sided).

2. Error Framework:
- Type I Error (alpha): Rejecting H0 when H0 is actually TRUE (False Positive). Significance level.
- Type II Error (beta): Failing to reject H0 when H0 is FALSE (False Negative).
- Statistical Power = 1 - beta: Probability of correctly detecting a real effect when one exists.

3. The p-value:
The probability of observing a test statistic as extreme as, or more extreme than, the observed data, assuming the null hypothesis H0 is true.
If p <= alpha, reject H0 in favor of Ha.

4. Confidence Intervals:
A 95% Confidence Interval for the mean:
CI = X_bar ± t_crit * (s / sqrt(n))
Meaning: If we repeated sampling many times, 95% of constructed intervals would contain the true population parameter.`,
    worked_example: {
      problem: "An e-commerce website runs an A/B test. Version A (control) has conversion rate 10.0%. Version B (new checkout) converts 12.0% across 1000 visitors per group. Does Version B provide a statistically significant improvement at alpha = 0.05?",
      solution: `H0: p_B - p_A = 0
Ha: p_B - p_A > 0 (one-tailed)

n_A = 1000, x_A = 100 (p_A = 0.10)
n_B = 1000, x_B = 120 (p_B = 0.12)

Step 1: Pooled conversion rate p_pool:
p_pool = (100 + 120) / (2000) = 220 / 2000 = 0.11

Step 2: Standard error of the difference:
SE = sqrt(p_pool * (1 - p_pool) * (1/n_A + 1/n_B))
SE = sqrt(0.11 * 0.89 * (2 / 1000)) = sqrt(0.0979 * 0.002) = sqrt(0.0001958) ≈ 0.0140

Step 3: Test statistic z:
z = (0.12 - 0.10) / 0.0140 = 0.02 / 0.0140 = 1.43

Step 4: p-value:
For one-tailed z = 1.43, p-value ≈ 0.0764

Conclusion: Since p-value (0.0764) > alpha (0.05), we fail to reject H0. The 2% lift is not statistically significant at the 5% significance level; more sample data is required.`,
      key_steps: [
        "State H0 and Ha explicitly.",
        "Calculate pooled proportion and standard error.",
        "Compute z-score and determine corresponding p-value.",
        "Compare p-value against alpha to make evidence-backed decision.",
      ],
    },
    common_mistakes: [
      "Interpreting p-value as 'the probability that H0 is true' (it is P(Data | H0), not P(H0 | Data)).",
      "Treating 'fail to reject H0' as 'proof that H0 is true' (absence of evidence is not evidence of absence).",
    ],
    practice_questions: [
      {
        prompt: "If alpha is decreased from 0.05 to 0.01, what happens to the risk of Type II error?",
        hint: "Making it harder to reject H0 increases the chance of missing real effects.",
        sample_answer: "Type II error (beta) increases, and statistical power decreases.",
      },
    ],
    prerequisites: ["stats-distributions"],
    related_topics: [],
  },

  // ----------------- DATA SCIENCE FUNDAMENTALS -----------------
  {
    id: "ds-data-wrangling",
    subject_id: "data-science",
    title: "Data Cleaning & Exploratory Data Analysis (EDA)",
    slug: "data-cleaning-eda",
    description: "Missing value imputation strategies, categorical encoding, feature scaling, and detecting data leakage.",
    difficulty: "beginner",
    order_index: 1,
    learning_objectives: [
      "Distinguish between Missing Completely at Random (MCAR), MAR, and MNAR",
      "Apply appropriate imputation (median, mode, iterative KNN) without data leakage",
      "Choose between One-Hot Encoding, Ordinal Encoding, and Target Encoding",
      "Scale features properly with StandardScaler vs MinMaxScaler vs RobustScaler",
    ],
    concept_explanation: `High quality predictive models require robust feature pipelines:
1. Handling Missing Data:
- MCAR: Missingness is purely random. Dropping rows or median imputation is unbiased.
- MAR: Missingness depends on observed features. Multiple imputation or model-based imputation works well.
- MNAR: Missingness relates to the unobserved value itself (e.g. high earners omitting income). Requires indicator flags.

2. Feature Scaling:
- StandardScaler: z = (x - mu) / sigma. Preserves zero-mean and unit variance. Essential for distance-based algorithms (KNN, SVM, K-Means) and gradient descent (Logistic Regression, Neural Nets).
- RobustScaler: Uses median and IQR, resistant to extreme outliers.

3. The Golden Rule against Data Leakage:
Fit transformers (scalers, encoders, imputers) ONLY on the training split, then transform both training and validation/test splits. Never fit on the entire dataset!`,
    worked_example: {
      problem: "Write a scikit-learn pipeline snippet that preprocesses numeric columns with median imputation and standard scaling, and categorical columns with one-hot encoding.",
      solution: `from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

numeric_features = ["age", "fare", "tenure"]
categorical_features = ["gender", "embarked", "contract_type"]

numeric_transformer = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="median")),
    ("scaler", StandardScaler())
])

categorical_transformer = Pipeline(steps=[
    ("imputer", SimpleImputer(strategy="most_frequent")),
    ("onehot", OneHotEncoder(handle_unknown="ignore", sparse_output=False))
])

preprocessor = ColumnTransformer(transformers=[
    ("num", numeric_transformer, numeric_features),
    ("cat", categorical_transformer, categorical_features)
])

# Usage:
# X_train_proc = preprocessor.fit_transform(X_train)
# X_test_proc = preprocessor.transform(X_test) # Notice: transform only!`,
      key_steps: [
        "Define distinct sub-pipelines for numeric and categorical feature subsets.",
        "Assemble them into a unified ColumnTransformer.",
        "Ensure handle_unknown='ignore' on OneHotEncoder to gracefully handle unseen test categories.",
        "Call fit_transform on training set, but only transform on test set to prevent leakage.",
      ],
    },
    common_mistakes: [
      "Calling fit_transform() on the whole dataset before splitting into train/test (catastrophic data leakage).",
      "Using OneHotEncoder on high-cardinality features (e.g. zip codes with 10,000 categories) causing dimensional explosion. Use target encoding or embeddings.",
    ],
    practice_questions: [
      {
        prompt: "Why should tree-based algorithms like Random Forest generally not require feature scaling, unlike Logistic Regression?",
        hint: "Consider how decision tree splits are computed.",
        sample_answer: "Decision trees partition features based on monotonic threshold ordering (e.g., x > 5), which is invariant to monotonic monotonic scaling transformations.",
      },
    ],
    prerequisites: [],
    related_topics: ["ds-feature-engineering", "ds-regression-classification"],
  },
  {
    id: "ds-feature-engineering",
    subject_id: "data-science",
    title: "Feature Engineering & Dimensionality Reduction",
    slug: "feature-engineering-pca",
    description: "Interaction features, binning, polynomial transformations, Principal Component Analysis (PCA), and variance explained.",
    difficulty: "intermediate",
    order_index: 2,
    learning_objectives: [
      "Synthesize domain-specific interaction features and ratios",
      "Understand Principal Component Analysis (PCA) as an orthogonal projection maximizing variance",
      "Select number of components using scree plots and cumulative explained variance ratio",
      "Avoid collinearity and multicollinearity with VIF (Variance Inflation Factor)",
    ],
    concept_explanation: `Feature engineering transforms raw attributes into signals that models can easily separate:
1. Domain Transforms:
- Ratios (e.g. debt_to_income = total_debt / annual_income)
- Log transforms: y = log1p(x) to compress heavy-tailed exponential distributions into near-Gaussian shapes.
- Datetime decomposition: day_of_week, is_weekend, hour, cyclical encoding via sin/cos.

2. Principal Component Analysis (PCA):
An unsupervised technique that finds orthogonal directions (eigenvectors of the covariance matrix) that maximize variance:
- The first principal component (PC1) accounts for the largest possible variance.
- Each successive component is orthogonal to preceding components.
- Scree Plot / Cumulative Variance: Pick enough components to explain 90% or 95% of total variance.`,
    worked_example: {
      problem: "Given a 50-feature sensor dataset, apply PCA to retain at least 90% of total variance and report how many components are required.",
      solution: `import numpy as np
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

# Assume X_train is available
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_train)

# Fit PCA retaining 90% variance threshold
pca = PCA(n_components=0.90, svd_solver="full")
X_pca = pca.fit_transform(X_scaled)

n_retained = pca.n_components_
total_var = np.sum(pca.explained_variance_ratio_)

print(f"Retained {n_retained} components explaining {total_var:.2%} of variance.")`,
      key_steps: [
        "Always scale features with StandardScaler prior to PCA, as PCA is sensitive to scale.",
        "Configure PCA with float argument 0.90 to dynamically determine component count.",
        "Transform features into reduced dimensional space.",
      ],
    },
    common_mistakes: [
      "Applying PCA without standardizing features (features with large numerical magnitudes dominate principal components).",
      "Using PCA as a black box without checking feature interpretability when business stakeholders require clear explanations.",
    ],
    practice_questions: [
      {
        prompt: "Why must features have zero mean and unit variance before running PCA?",
        hint: "Covariance calculation depends on feature scale.",
        sample_answer: "Without standardization, features with artificially large units (e.g. income in dollars vs age in years) will dominate the eigenvalues regardless of true variance.",
      },
    ],
    prerequisites: ["ds-data-wrangling"],
    related_topics: ["ds-regression-classification"],
  },
  {
    id: "ds-regression-classification",
    subject_id: "data-science",
    title: "Supervised Learning: Regression & Classification",
    slug: "regression-classification-algorithms",
    description: "Linear regression, logistic regression, decision trees, bias-variance tradeoff, and regularizations (L1 Lasso, L2 Ridge).",
    difficulty: "intermediate",
    order_index: 3,
    learning_objectives: [
      "Explain the Bias-Variance Tradeoff and identify underfitting vs overfitting",
      "Contrast L1 Lasso (sparsity/feature selection) and L2 Ridge (weight shrinkage)",
      "Understand Logistic Regression as a linear classifier passing log-odds through the sigmoid function",
      "Interpret decision tree splitting criteria (Gini impurity vs Information Gain/Entropy)",
    ],
    concept_explanation: `Supervised learning maps input features X to targets y:
1. Bias-Variance Tradeoff:
- High Bias (Underfitting): Model is too simple to capture patterns. High training and validation errors.
- High Variance (Overfitting): Model memorizes training noise. Low training error but high validation error.

2. Regularization in Linear Models:
- Ridge (L2): Adds penalty lambda * sum(w_j^2). Shrinks coefficients smoothly towards zero. Ideal when many collinear features contribute small effects.
- Lasso (L1): Adds penalty lambda * sum(|w_j|). Drives non-essential coefficients to exactly zero, performing automatic feature selection.

3. Logistic Regression:
Models probability of class 1:
P(Y=1|X) = 1 / (1 + exp(- (w^T * X + b)))
Optimized via cross-entropy loss (log loss). Decision boundary is linear in feature space.`,
    worked_example: {
      problem: "Train a regularized logistic regression model with cross-validation on tabular marketing data, reporting training and validation accuracy to assess overfitting.",
      solution: `from sklearn.linear_model import LogisticRegressionCV
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report

X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# LogisticRegressionCV automatically tunes the regularization parameter C
clf = LogisticRegressionCV(
    Cs=10, 
    cv=5, 
    penalty="l2", 
    solver="lbfgs", 
    max_iter=1000, 
    random_state=42
)
clf.fit(X_train, y_train)

train_acc = clf.score(X_train, y_train)
val_acc = clf.score(X_val, y_val)

print(f"Train Accuracy: {train_acc:.3f} | Validation Accuracy: {val_acc:.3f}")
print(f"Optimal C: {clf.C_[0]:.4f}")`,
      key_steps: [
        "Stratify train/test split to preserve class balance.",
        "Employ cross-validated tuning over multiple candidate inverse regularization strengths (C).",
        "Compare train vs validation scores to confirm model generalizes without high variance.",
      ],
    },
    common_mistakes: [
      "Using accuracy as the sole evaluation metric when classes are severely imbalanced (e.g. 99% negative class).",
      "Interpreting linear regression coefficients when features are highly collinear without regularization.",
    ],
    practice_questions: [
      {
        prompt: "Which regularization technique creates sparse weight vectors with coefficients set to exact zero: Lasso (L1) or Ridge (L2)?",
        hint: "Diamond constraint vs circular constraint boundary.",
        sample_answer: "Lasso (L1) produces exact zero coefficients due to the sharp corners of the L1 diamond ball.",
      },
    ],
    prerequisites: ["ds-feature-engineering"],
    related_topics: ["ds-model-evaluation"],
  },
  {
    id: "ds-model-evaluation",
    subject_id: "data-science",
    title: "Model Evaluation, Validation & ROC-AUC",
    slug: "model-evaluation-roc-auc",
    description: "K-Fold cross-validation, confusion matrices, precision, recall, F1-score, ROC curves, and PR-AUC for imbalanced datasets.",
    difficulty: "advanced",
    order_index: 4,
    learning_objectives: [
      "Construct and interpret confusion matrices (TP, FP, TN, FN)",
      "Select appropriate evaluation metrics: Precision vs Recall vs F1-score",
      "Calculate and interpret Receiver Operating Characteristic (ROC) and Area Under the Curve (AUC)",
      "Implement Stratified K-Fold Cross-Validation to validate model generalization",
    ],
    concept_explanation: `Evaluating models correctly prevents deploying models that fail in production:
1. Confusion Matrix Metrics:
- Precision = TP / (TP + FP): Fraction of positive predictions that were correct (crucial when false alarms are costly, like spam detection).
- Recall (Sensitivity) = TP / (TP + FN): Fraction of actual positives detected (crucial when misses are fatal, like cancer screening or fraud).
- F1-Score = 2 * (Precision * Recall) / (Precision + Recall): Harmonic mean, balancing precision and recall.

2. ROC Curve & AUC:
Plots True Positive Rate (Recall) vs False Positive Rate (FPR = FP / (FP + TN)) across all possible classification decision thresholds (from 0.0 to 1.0).
- AUC = 1.0: Perfect ranking.
- AUC = 0.5: Random coin flip performance.
- In severely imbalanced datasets (e.g. 0.1% fraud), the Precision-Recall (PR) curve and PR-AUC are far more informative than ROC-AUC because FPR remains misleadingly small due to large TN counts.`,
    worked_example: {
      problem: "In a fraud detection dataset with 10,000 transactions and 100 fraudulent transactions (1%), evaluate a model that predicted 80 true frauds, 40 false alarms, and missed 20 frauds. Calculate Precision, Recall, and F1-score.",
      solution: `Given:
- True Positives (TP) = 80
- False Positives (FP) = 40
- False Negatives (FN) = 20
- True Negatives (TN) = 10,000 - (80 + 40 + 20) = 9,860

Step 1: Precision = TP / (TP + FP)
Precision = 80 / (80 + 40) = 80 / 120 ≈ 0.667 (66.7%)

Step 2: Recall = TP / (TP + FN)
Recall = 80 / (80 + 20) = 80 / 100 = 0.800 (80.0%)

Step 3: F1-Score:
F1 = 2 * (Precision * Recall) / (Precision + Recall)
F1 = 2 * (0.667 * 0.800) / (0.667 + 0.800) = 1.067 / 1.467 ≈ 0.727

Accuracy would be (9860 + 80) / 10,000 = 99.4%, which is misleading since a naive model predicting all non-fraud achieves 99.0%!`,
      key_steps: [
        "Map prediction counts into TP, FP, FN, and TN.",
        "Compute Precision (correct positive rate) and Recall (capture rate).",
        "Synthesize with harmonic mean F1-Score to reflect true performance on the positive class.",
      ],
    },
    common_mistakes: [
      "Relying on accuracy for imbalanced classification tasks.",
      "Evaluating ROC-AUC without checking the threshold in production; a model with 0.90 AUC can still fail if threshold is set inappropriately.",
    ],
    practice_questions: [
      {
        prompt: "In a medical screening test where missing an illness is catastrophic, which metric should be prioritized: Precision or Recall?",
        hint: "False negatives must be minimized.",
        sample_answer: "Recall must be prioritized to minimize False Negatives (missed diagnoses).",
      },
    ],
    prerequisites: ["ds-regression-classification"],
    related_topics: [],
  },
];

export const SEED_QUESTIONS: Question[] = [
  // ---------------- PYTHON QUESTIONS ----------------
  {
    id: "q_py_cf_1",
    topic_id: "py-control-flow",
    question_text: "What is the output of the expression `bool([] or 0 or 'False' or None)` in Python 3?",
    question_type: "mcq",
    options: ["True", "False", "None", "TypeError"],
    correct_answer: "True",
    explanation: "Python evaluates short-circuit boolean logic. Empty list `[]` is falsy, `0` is falsy, but the non-empty string `'False'` is truthy! Therefore `'False'` is returned, and `bool('False')` is True.",
    difficulty: "beginner",
    points: 10,
  },
  {
    id: "q_py_cf_2",
    topic_id: "py-control-flow",
    question_text: "In Python, modifying a list while iterating over it with a `for item in my_list:` loop is guaranteed to be safe and deterministic.",
    question_type: "true_false",
    options: ["True", "False"],
    correct_answer: "False",
    explanation: "Modifying a list (adding or removing elements) while iterating over it causes the internal index pointer to skip items or re-examine items unpredictably. Iterate over a slice copy `my_list[:]` or use a comprehension instead.",
    difficulty: "beginner",
    points: 10,
  },
  {
    id: "q_py_cf_3",
    topic_id: "py-control-flow",
    question_text: "Given `nums = [1, 2, 3, 4, 5]`, what does `[x * 2 for x in nums if x % 2 != 0]` produce?",
    question_type: "mcq",
    options: ["[2, 6, 10]", "[4, 8]", "[2, 4, 6, 8, 10]", "[1, 3, 5]"],
    correct_answer: "[2, 6, 10]",
    explanation: "The condition `if x % 2 != 0` filters for odd numbers: 1, 3, and 5. Each is multiplied by 2, yielding [2, 6, 10].",
    difficulty: "beginner",
    points: 10,
  },
  {
    id: "q_py_fn_1",
    topic_id: "py-functions-scope",
    question_text: "Why is `def append_to(element, target=[])` considered an anti-pattern in Python?",
    question_type: "mcq",
    options: [
      "Default arguments are evaluated once at function definition time, sharing the list across calls",
      "Python does not permit list literals in parameter signatures",
      "The list becomes read-only inside the function body",
      "It raises a SyntaxError in Python 3.10+"
    ],
    correct_answer: "Default arguments are evaluated once at function definition time, sharing the list across calls",
    explanation: "Python evaluates default argument expressions once when the `def` statement executes. A mutable object like a list retains modifications across subsequent calls that omit the parameter.",
    difficulty: "intermediate",
    points: 15,
  },
  {
    id: "q_py_fn_2",
    topic_id: "py-functions-scope",
    question_text: "What does the LEGB rule stand for regarding variable lookup in Python?",
    question_type: "mcq",
    options: [
      "Local, Enclosing, Global, Built-in",
      "Lexical, External, Generic, Base",
      "Linear, Enclosed, Grouped, Binary",
      "Local, Extended, Global, Bytecode"
    ],
    correct_answer: "Local, Enclosing, Global, Built-in",
    explanation: "Python resolves variable identifiers by searching Local scope first, then any Enclosing functions, then Global (module) scope, and finally Built-ins.",
    difficulty: "intermediate",
    points: 15,
  },
  {
    id: "q_py_ds_1",
    topic_id: "py-data-structures",
    question_text: "What is the average time complexity of checking membership (`x in collection`) for a Python `set` versus a Python `list`?",
    question_type: "mcq",
    options: [
      "O(1) for set, O(N) for list",
      "O(N) for set, O(1) for list",
      "O(log N) for set, O(N) for list",
      "O(1) for both"
    ],
    correct_answer: "O(1) for set, O(N) for list",
    explanation: "Python sets are implemented as hash tables with amortized O(1) average lookup time. Lists require scanning elements linearly from index 0 to N-1, which is O(N).",
    difficulty: "intermediate",
    points: 15,
  },
  {
    id: "q_py_oop_1",
    topic_id: "py-oop",
    question_text: "Which magic dunder method allows a user-defined class object to be used with the built-in `len()` function?",
    question_type: "mcq",
    options: ["__len__", "__size__", "__count__", "__length__"],
    correct_answer: "__len__",
    explanation: "Calling `len(obj)` directly invokes `obj.__len__()`, which must return a non-negative integer.",
    difficulty: "intermediate",
    points: 15,
  },

  // ---------------- SQL QUESTIONS ----------------
  {
    id: "q_sql_sf_1",
    topic_id: "sql-select-filtering",
    question_text: "In standard SQL logical query processing, which clause is evaluated first?",
    question_type: "mcq",
    options: ["FROM", "SELECT", "WHERE", "ORDER BY"],
    correct_answer: "FROM",
    explanation: "Logically, SQL must first identify and join the tables in the FROM clause before filtering rows (WHERE), grouping (GROUP BY), or projecting columns (SELECT).",
    difficulty: "beginner",
    points: 10,
  },
  {
    id: "q_sql_sf_2",
    topic_id: "sql-select-filtering",
    question_text: "What is the result of the SQL expression `NULL = NULL`?",
    question_type: "mcq",
    options: ["UNKNOWN", "TRUE", "FALSE", "NULL"],
    correct_answer: "UNKNOWN",
    explanation: "Under SQL's three-valued logic, NULL represents an unknown value. Comparing two unknown values yields UNKNOWN, which is why `col IS NULL` must be used instead.",
    difficulty: "intermediate",
    points: 15,
  },
  {
    id: "q_sql_join_1",
    topic_id: "sql-joins-relationships",
    question_text: "What happens if you place a condition `WHERE orders.status = 'shipped'` on a table included via `LEFT JOIN customers LEFT JOIN orders`?",
    question_type: "mcq",
    options: [
      "It effectively turns the query into an INNER JOIN, discarding customers with no orders",
      "It preserves customers with no orders and sets status to 'shipped'",
      "It raises a SQL compilation syntax error",
      "It produces a Cartesian product"
    ],
    correct_answer: "It effectively turns the query into an INNER JOIN, discarding customers with no orders",
    explanation: "In a LEFT JOIN, rows with no orders have NULL for `orders.status`. The WHERE clause filters out rows where `NULL = 'shipped'` (which evaluates to UNKNOWN), discarding all customers who have no orders.",
    difficulty: "intermediate",
    points: 15,
  },
  {
    id: "q_sql_wf_1",
    topic_id: "sql-window-functions",
    question_text: "What is the key difference between `RANK()` and `DENSE_RANK()` when multiple rows tie?",
    question_type: "mcq",
    options: [
      "RANK() leaves gaps in rank numbers after ties; DENSE_RANK() does not",
      "DENSE_RANK() leaves gaps; RANK() does not",
      "RANK() can only be used with numbers; DENSE_RANK() works with strings",
      "DENSE_RANK() requires a GROUP BY clause"
    ],
    correct_answer: "RANK() leaves gaps in rank numbers after ties; DENSE_RANK() does not",
    explanation: "If two rows tie for 1st place, `RANK()` gives ranks (1, 1, 3), skipping 2. `DENSE_RANK()` gives ranks (1, 1, 2) without skipping.",
    difficulty: "advanced",
    points: 20,
  },

  // ---------------- STATS QUESTIONS ----------------
  {
    id: "q_stats_desc_1",
    topic_id: "stats-descriptive",
    question_text: "In a heavily right-skewed distribution of household income, which measure of central tendency is typically the most representative of the typical household?",
    question_type: "mcq",
    options: ["Median", "Mean", "Standard Deviation", "Maximum"],
    correct_answer: "Median",
    explanation: "Extreme high earners pull the mean significantly upward. The median (50th percentile) is robust and not skewed by extreme outliers.",
    difficulty: "beginner",
    points: 10,
  },
  {
    id: "q_stats_prob_1",
    topic_id: "stats-probability-rules",
    question_text: "If events A and B are independent, what is P(A and B)?",
    question_type: "mcq",
    options: ["P(A) * P(B)", "P(A) + P(B)", "P(A) / P(B)", "P(A|B) + P(B|A)"],
    correct_answer: "P(A) * P(B)",
    explanation: "By mathematical definition of independence, the occurrence of A does not alter the probability of B, so P(A and B) = P(A) * P(B).",
    difficulty: "intermediate",
    points: 15,
  },
  {
    id: "q_stats_dist_1",
    topic_id: "stats-distributions",
    question_text: "According to the Central Limit Theorem, what happens to the sampling distribution of the sample mean as sample size n increases?",
    question_type: "mcq",
    options: [
      "It approaches a normal distribution, regardless of the population distribution shape",
      "It becomes identical to the original population distribution",
      "Its standard error increases proportionally with sqrt(n)",
      "It becomes a uniform distribution"
    ],
    correct_answer: "It approaches a normal distribution, regardless of the population distribution shape",
    explanation: "The Central Limit Theorem proves that the sum or mean of independent random variables approaches a normal distribution as sample size grows, even if the underlying population is skewed or non-normal.",
    difficulty: "intermediate",
    points: 15,
  },
  {
    id: "q_stats_ht_1",
    topic_id: "stats-hypothesis-testing",
    question_text: "A Type I error (alpha) occurs when we:",
    question_type: "mcq",
    options: [
      "Reject the null hypothesis when the null hypothesis is actually true",
      "Fail to reject the null hypothesis when it is actually false",
      "Use a two-tailed test instead of a one-tailed test",
      "Have an insufficient sample size"
    ],
    correct_answer: "Reject the null hypothesis when the null hypothesis is actually true",
    explanation: "Type I error is a False Positive: rejecting a true null hypothesis. The significance level alpha sets the maximum acceptable probability of committing a Type I error.",
    difficulty: "advanced",
    points: 20,
  },

  // ---------------- DATA SCIENCE QUESTIONS ----------------
  {
    id: "q_ds_dw_1",
    topic_id: "ds-data-wrangling",
    question_text: "To avoid data leakage during machine learning preprocessing, when should feature scalers and imputers be fitted?",
    question_type: "mcq",
    options: [
      "Fitted ONLY on the training split, then applied to both train and test splits",
      "Fitted on the entire combined dataset before splitting",
      "Fitted on the test split and applied to the training split",
      "Feature scaling does not cause data leakage"
    ],
    correct_answer: "Fitted ONLY on the training split, then applied to both train and test splits",
    explanation: "Fitting transformers on test data leaks future information (like test mean and variance) into the training process, causing overly optimistic validation metrics that fail in production.",
    difficulty: "beginner",
    points: 10,
  },
  {
    id: "q_ds_rc_1",
    topic_id: "ds-regression-classification",
    question_text: "Which regularization method is capable of performing feature selection by driving non-informative feature weights to exact zero?",
    question_type: "mcq",
    options: ["Lasso (L1 Regularization)", "Ridge (L2 Regularization)", "Batch Normalization", "Dropout"],
    correct_answer: "Lasso (L1 Regularization)",
    explanation: "L1 regularization uses an absolute value penalty term. The sharp corners of the L1 norm ball cause the optimal loss solution to intersect axes at exact zeros, effectively selecting features.",
    difficulty: "intermediate",
    points: 15,
  },
  {
    id: "q_ds_me_1",
    topic_id: "ds-model-evaluation",
    question_text: "In a medical diagnostic classifier for an aggressive disease, why is Recall typically prioritized over Precision?",
    question_type: "mcq",
    options: [
      "Because missing a diseased patient (False Negative) has catastrophic consequences",
      "Because False Positives are illegal in medicine",
      "Because Recall is always computationally faster to calculate",
      "Because Precision cannot be calculated if classes are imbalanced"
    ],
    correct_answer: "Because missing a diseased patient (False Negative) has catastrophic consequences",
    explanation: "Recall measures TP / (TP + FN). In critical screening, minimizing False Negatives (capturing virtually all sick patients for follow-up testing) is paramount even if it incurs some False Positives.",
    difficulty: "advanced",
    points: 20,
  },
];

export const SEED_RESOURCES: LearningResource[] = [
  {
    id: "res-py-1",
    topic_id: "py-control-flow",
    title: "Python Official Documentation: Control Flow Tools",
    url: "https://docs.python.org/3/tutorial/controlflow.html",
    resource_type: "documentation",
    author: "Python Software Foundation",
    summary: "The canonical reference for Python if-statements, for-loops, range generators, and iteration protocols.",
  },
  {
    id: "res-py-2",
    topic_id: "py-functions-scope",
    title: "PEP 318 – Decorators for Functions and Methods",
    url: "https://peps.python.org/pep-0318/",
    resource_type: "article",
    author: "Python Enhancement Proposals",
    summary: "Deep architectural rationale behind Python's decorator syntax and callable wrapping semantics.",
  },
  {
    id: "res-sql-1",
    topic_id: "sql-select-filtering",
    title: "PostgreSQL Official Documentation: Queries & Expressions",
    url: "https://www.postgresql.org/docs/current/queries.html",
    resource_type: "documentation",
    author: "The PostgreSQL Global Development Group",
    summary: "Comprehensive guide to relational expressions, three-valued logic, and query planning.",
  },
  {
    id: "res-sql-2",
    topic_id: "sql-window-functions",
    title: "PostgreSQL Window Functions Tutorial",
    url: "https://www.postgresql.org/docs/current/tutorial-window.html",
    resource_type: "documentation",
    author: "The PostgreSQL Global Development Group",
    summary: "Step-by-step introduction to OVER(), PARTITION BY, and framing in analytical SQL queries.",
  },
  {
    id: "res-stats-1",
    topic_id: "stats-probability-rules",
    title: "Seeing Theory: A Visual Introduction to Probability and Data",
    url: "https://seeing-theory.brown.edu/",
    resource_type: "interactive",
    author: "Brown University",
    summary: "Interactive visualizations of Bayesian inference, compound probability, and continuous distributions.",
  },
  {
    id: "res-ds-1",
    topic_id: "ds-model-evaluation",
    title: "Scikit-Learn Guide: Model Evaluation and Metrics",
    url: "https://scikit-learn.org/stable/modules/model_evaluation.html",
    resource_type: "documentation",
    author: "Scikit-Learn Developers",
    summary: "Mathematical definitions and code examples for ROC-AUC, precision-recall, log loss, and cross-validation.",
  },
];
