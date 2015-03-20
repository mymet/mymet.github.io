# Recommendation System

These examples are based on the book *Programming Collective Intelligence*, by Toby Segaran.

The code snippets were split into separate files, to make them easy to reuse.

---


## User-based Collaborative Filtering

* **recommendations.py**: finds recommendations for a given person
* **similar_users.py**: finds people similar to a given person
* **similar_items.py**: given an item, finds similar ones based on how they were rated by people

All files depend on:

* **ratings_dic.py**: the dictionary (associative array). In this case, a list of people and movie ratings in the format { user: { item: rating }, ...}, ...}
* **similarity_score_pearson.py**: given 2 people, calculates their Pearson correlation.
* **similariry_score_euclidean.py**: not really using this one, but it's an alternative method to Pearson.


	
