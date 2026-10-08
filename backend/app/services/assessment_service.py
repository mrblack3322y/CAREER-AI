"""
Assessment Engine and Question Bank for CareerAI (MVP Scope).
Focuses on 4 Core Categories:
  - Python (6 questions)
  - SQL (6 questions)
  - Machine Learning (6 questions)
  - Statistics (6 questions)
Total: 24 carefully curated technical MCQs.
Tracks score, correct answers, and category performance.
"""

from typing import List, Dict, Any, Optional

ASSESSMENT_QUESTIONS: List[Dict[str, Any]] = [
    # --- Python (6 questions) ---
    {
        "id": "py_01",
        "category": "Python",
        "question": "What is the average time complexity of key lookup in a standard Python dictionary?",
        "options": ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        "correct_answer": 0,
        "difficulty": "Easy",
        "explanation": "Python dictionaries use hash tables, providing average-case O(1) key lookups."
    },
    {
        "id": "py_02",
        "category": "Python",
        "question": "Which of the following built-in data types is immutable in Python?",
        "options": ["List", "Dictionary", "Tuple", "Set"],
        "correct_answer": 2,
        "difficulty": "Easy",
        "explanation": "Tuples cannot be modified after creation, making them immutable sequences."
    },
    {
        "id": "py_03",
        "category": "Python",
        "question": "What is the primary function of Python's `enumerate()` built-in?",
        "options": [
            "Counts the number of elements in a collection",
            "Returns an iterator yielding index and value tuples",
            "Converts strings into numeric values",
            "Sorts a list in ascending order"
        ],
        "correct_answer": 1,
        "difficulty": "Easy",
        "explanation": "`enumerate(iterable)` returns pairs containing a count (from start) and the values obtained from iterating over iterable."
    },
    {
        "id": "py_04",
        "category": "Python",
        "question": "What is the difference between `deepcopy` and `copy` in Python's `copy` module?",
        "options": [
            "`copy` duplicates nested objects recursively; `deepcopy` does not",
            "`deepcopy` constructs a new compound object and recursively inserts copies of objects found in original",
            "`copy` only works on primitives",
            "`deepcopy` converts lists to tuples"
        ],
        "correct_answer": 1,
        "difficulty": "Medium",
        "explanation": "`deepcopy` duplicates compound objects recursively, while a shallow `copy` only copies outer references."
    },
    {
        "id": "py_05",
        "category": "Python",
        "question": "How do Python list comprehensions compare with traditional `for` loops in performance?",
        "options": [
            "List comprehensions are typically faster because the loop executes in optimized C bytecode",
            "Traditional `for` loops are always faster due to lazy evaluation",
            "There is no performance difference under CPython",
            "List comprehensions require more memory than generators or manual loops"
        ],
        "correct_answer": 0,
        "difficulty": "Medium",
        "explanation": "List comprehensions execute loop operations in optimized C bytecode inside CPython, generally running faster than interpreted append loops."
    },
    {
        "id": "py_06",
        "category": "Python",
        "question": "What does Python's `__slots__` declaration in a class achieve?",
        "options": [
            "Enforces static type checking at runtime",
            "Prevents the creation of `__dict__` and saves memory by reserving space for declared attributes only",
            "Automatically serializes the class to JSON",
            "Protects methods from inheritance overriding"
        ],
        "correct_answer": 1,
        "difficulty": "Hard",
        "explanation": "`__slots__` reserves space for declared attributes directly, avoiding the per-instance `__dict__` overhead and significantly reducing RAM usage."
    },

    # --- SQL (6 questions) ---
    {
        "id": "sql_01",
        "category": "SQL",
        "question": "What is the primary difference between WHERE and HAVING clauses in SQL?",
        "options": [
            "WHERE is for string filters; HAVING is for numbers",
            "WHERE filters rows before aggregation; HAVING filters groups after aggregation",
            "HAVING can only be used with subqueries",
            "WHERE operates only on indexed primary keys"
        ],
        "correct_answer": 1,
        "difficulty": "Easy",
        "explanation": "WHERE filters rows before GROUP BY; HAVING applies conditions to aggregated records after GROUP BY."
    },
    {
        "id": "sql_02",
        "category": "SQL",
        "question": "Which SQL statement is used to remove all records from a table without logging individual row deletions?",
        "options": ["DELETE FROM", "TRUNCATE TABLE", "DROP TABLE", "REMOVE FROM"],
        "correct_answer": 1,
        "difficulty": "Easy",
        "explanation": "TRUNCATE TABLE quickly removes all rows from a table by deallocating data pages, with minimal transaction log overhead."
    },
    {
        "id": "sql_03",
        "category": "SQL",
        "question": "Which window function assigns a sequential integer to each row within a partition without ties?",
        "options": ["RANK()", "DENSE_RANK()", "ROW_NUMBER()", "NTILE()"],
        "correct_answer": 2,
        "difficulty": "Medium",
        "explanation": "ROW_NUMBER() generates a continuous sequential integer (1, 2, 3...) regardless of duplicate ordering values."
    },
    {
        "id": "sql_04",
        "category": "SQL",
        "question": "What is the purpose of an SQL index?",
        "options": [
            "To encrypt data in disk storage",
            "To speed up data retrieval operations at the cost of additional storage and slower writes",
            "To automatically generate primary key sequences",
            "To compress text columns"
        ],
        "correct_answer": 1,
        "difficulty": "Medium",
        "explanation": "Indexes (e.g. B-Trees) speed up SELECT queries while adding write overhead on INSERT, UPDATE, and DELETE."
    },
    {
        "id": "sql_05",
        "category": "SQL",
        "question": "In database transactions, what does the 'I' in ACID stand for?",
        "options": ["Integrity", "Isolation", "Immutability", "Indexing"],
        "correct_answer": 1,
        "difficulty": "Medium",
        "explanation": "Isolation ensures concurrent transactions execute without interfering with one another's intermediate states."
    },
    {
        "id": "sql_06",
        "category": "SQL",
        "question": "What is a correlated subquery in SQL?",
        "options": [
            "A query that runs once before the outer query executes",
            "A subquery that references columns from the outer query and evaluates once for each candidate row",
            "A subquery containing a JOIN clause with another database",
            "A view created inside a temporary table"
        ],
        "correct_answer": 1,
        "difficulty": "Hard",
        "explanation": "Correlated subqueries depend on values from the outer query, meaning they are executed once per outer row."
    },

    # --- Machine Learning (6 questions) ---
    {
        "id": "ml_01",
        "category": "Machine Learning",
        "question": "Which evaluation metric is best suited for assessing a classifier on a severe class imbalance?",
        "options": ["Accuracy", "F1-Score / PR-AUC", "Mean Squared Error", "R² Score"],
        "correct_answer": 1,
        "difficulty": "Easy",
        "explanation": "Accuracy is misleading when negative cases dominate. F1-Score balances Precision and Recall on the minority class."
    },
    {
        "id": "ml_02",
        "category": "Machine Learning",
        "question": "What characterizes overfitting in a machine learning model?",
        "options": [
            "Low training error and high test error",
            "High training error and high test error",
            "Low training error and low test error",
            "Model is too simple to capture linear trends"
        ],
        "correct_answer": 0,
        "difficulty": "Easy",
        "explanation": "Overfitting happens when a model learns noise in training data, achieving low training error but failing to generalize to test data."
    },
    {
        "id": "ml_03",
        "category": "Machine Learning",
        "question": "How does Random Forest reduce model variance compared to a single decision tree?",
        "options": [
            "By boosting sequential errors of weak learners",
            "Through bootstrap aggregation (bagging) and random feature subspace selection across diverse trees",
            "By eliminating pruning",
            "By converting trees into neural activations"
        ],
        "correct_answer": 1,
        "difficulty": "Medium",
        "explanation": "Random Forest averages uncorrelated trees trained on bootstrap samples and random feature subsets, stabilizing variance."
    },
    {
        "id": "ml_04",
        "category": "Machine Learning",
        "question": "What does L1 (Lasso) regularization promote in linear models?",
        "options": [
            "Smoothly shrinks weights toward zero without setting any exactly to zero",
            "Enforces exact zero coefficients for irrelevant features, performing automatic feature selection",
            "Doubles model capacity",
            "Decreases learning rate exponentially"
        ],
        "correct_answer": 1,
        "difficulty": "Medium",
        "explanation": r"L1 penalty ($\lambda \sum |w_i|$) drives non-critical coefficients to exactly zero, producing sparse models."
    },
    {
        "id": "ml_05",
        "category": "Machine Learning",
        "question": "Why is cross-validation (e.g., k-fold) preferred over a single train-test split?",
        "options": [
            "It guarantees 100% test accuracy",
            "It evaluates model generalization across multiple independent subsets, reducing evaluation variance",
            "It eliminates the need for feature engineering",
            "It runs faster than a standard single fit"
        ],
        "correct_answer": 1,
        "difficulty": "Medium",
        "explanation": "K-fold cross-validation averages performance metrics across $k$ splits, providing a robust estimate of generalization."
    },
    {
        "id": "ml_06",
        "category": "Machine Learning",
        "question": "What is data leakage in a machine learning preprocessing pipeline?",
        "options": [
            "Accidental disclosure of user passwords",
            "When information from outside the training dataset (such as test set statistics) is used to train or scale the model",
            "Memory buffer overflow during batch gradient descent",
            "Missing values in the target column"
        ],
        "correct_answer": 1,
        "difficulty": "Hard",
        "explanation": "Data leakage occurs when test set signals inadvertently influence feature transformations (e.g. fitting a Scaler on the entire dataset prior to splitting)."
    },

    # --- Statistics (6 questions) ---
    {
        "id": "stats_01",
        "category": "Statistics",
        "question": "What does the Central Limit Theorem (CLT) state about the sampling distribution of sample means?",
        "options": [
            "It is always skewed right",
            "It approaches a normal distribution as sample size $n$ increases, regardless of population distribution",
            "The mean is always equal to 1",
            "The variance increases linearly with sample size"
        ],
        "correct_answer": 1,
        "difficulty": "Easy",
        "explanation": "The CLT states that the distribution of sample means approaches normality as sample size increases, provided finite variance."
    },
    {
        "id": "stats_02",
        "category": "Statistics",
        "question": "What does a p-value of 0.02 indicate when testing at significance level alpha = 0.05?",
        "options": [
            "Fail to reject the null hypothesis",
            "Reject the null hypothesis because p < alpha, indicating statistically significant evidence",
            "The experiment is flawed",
            "There is a 98% probability the null hypothesis is true"
        ],
        "correct_answer": 1,
        "difficulty": "Easy",
        "explanation": "When $p < \alpha$, we reject the null hypothesis in favor of the alternative hypothesis."
    },
    {
        "id": "stats_03",
        "category": "Statistics",
        "question": "Which measure of central tendency is least sensitive to extreme outliers?",
        "options": ["Mean", "Median", "Standard Deviation", "Range"],
        "correct_answer": 1,
        "difficulty": "Easy",
        "explanation": "The median represents the middle ranked value and is robust against skewed outliers compared to the arithmetic mean."
    },
    {
        "id": "stats_04",
        "category": "Statistics",
        "question": "What is the difference between Type I and Type II errors?",
        "options": [
            "Type I is false negative; Type II is false positive",
            "Type I is false positive (rejecting true null); Type II is false negative (failing to reject false null)",
            "Type I happens in regression; Type II in classification",
            "Type I is rounding error; Type II is sampling bias"
        ],
        "correct_answer": 1,
        "difficulty": "Medium",
        "explanation": "Type I error is a False Positive ($\alpha$). Type II error is a False Negative ($\beta$)."
    },
    {
        "id": "stats_05",
        "category": "Statistics",
        "question": "What range of values can Pearson's correlation coefficient ($r$) take?",
        "options": ["0 to 1", "-1 to 1", "-infinity to +infinity", "0 to 100"],
        "correct_answer": 1,
        "difficulty": "Medium",
        "explanation": "Pearson's $r$ ranges from -1 (perfect negative linear correlation) to +1 (perfect positive linear correlation)."
    },
    {
        "id": "stats_06",
        "category": "Statistics",
        "question": "What does standard error of the mean (SEM) represent?",
        "options": [
            "The error caused by human data entry",
            r"The standard deviation of the sampling distribution of the sample mean ($\sigma / \sqrt{n}$)",
            "The difference between maximum and minimum values in a sample",
            "The square root of the population variance"
        ],
        "correct_answer": 1,
        "difficulty": "Hard",
        "explanation": r"The Standard Error ($\text{SE} = \frac{s}{\sqrt{n}}$) measures the precision of the sample mean as an estimate of the true population mean."
    }
]

class AssessmentEngine:
    """Manages assessment question retrieval and scoring."""

    @staticmethod
    def get_assessment_questions(
        category: Optional[str] = None,
        count: int = 8
    ) -> List[Dict[str, Any]]:
        """Return questions with answers omitted for test-taking."""
        import random
        pool = ASSESSMENT_QUESTIONS
        if category and category != "All":
            pool = [q for q in pool if q["category"].lower() == category.lower()]

        selected = random.sample(pool, min(count, len(pool)))
        sanitized = []
        for q in selected:
            sanitized.append({
                "id": q["id"],
                "category": q["category"],
                "question": q["question"],
                "options": q["options"],
                "difficulty": q["difficulty"]
            })
        return sanitized

    @staticmethod
    def evaluate_submission(answers: Dict[str, int]) -> Dict[str, Any]:
        """Evaluates submitted answer indices."""
        q_map = {q["id"]: q for q in ASSESSMENT_QUESTIONS}
        correct_count = 0
        total_questions = len(answers)
        category_stats: Dict[str, Dict[str, int]] = {}
        detailed_results = []

        for q_id, user_choice in answers.items():
            question = q_map.get(q_id)
            if not question:
                continue

            cat = question["category"]
            if cat not in category_stats:
                category_stats[cat] = {"correct": 0, "total": 0}
            category_stats[cat]["total"] += 1

            is_correct = (user_choice == question["correct_answer"])
            if is_correct:
                correct_count += 1
                category_stats[cat]["correct"] += 1

            detailed_results.append({
                "id": q_id,
                "question": question["question"],
                "category": cat,
                "selected_option": question["options"][user_choice] if 0 <= user_choice < len(question["options"]) else "Skipped",
                "correct_option": question["options"][question["correct_answer"]],
                "is_correct": is_correct,
                "explanation": question["explanation"]
            })

        overall_pct = round((correct_count / max(total_questions, 1)) * 100, 1)

        category_performance = {
            cat: round((stats["correct"] / max(stats["total"], 1)) * 100, 1)
            for cat, stats in category_stats.items()
        }

        return {
            "total_questions": total_questions,
            "correct_count": correct_count,
            "incorrect_count": total_questions - correct_count,
            "overall_score": overall_pct,
            "category_performance": category_performance,
            "detailed_review": detailed_results
        }
