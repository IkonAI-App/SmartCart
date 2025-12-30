import algoliasearch from 'algoliasearch';

const APPLICATION_ID = 'P4TK45JU0B';
const API_KEY = '0fd2b90ced718f518448322f9a5e4ccf';
const INDEX_NAME = 'products_manual';

const algoliaClient = algoliasearch(APPLICATION_ID, API_KEY);
const index = algoliaClient.initIndex(INDEX_NAME);

async function updateIndexSettings() {
  try {
    console.log(`Updating settings for index: ${INDEX_NAME}...`);

    const settings = {
      // Searchable attributes - prioritize product name, then description
      searchableAttributes: [
        'pr_engname',           // Product name (highest priority)
        'content_en',            // Description
        'online_category_l1_en', // Category (for context)
      ],

      // Attributes for faceting (filtering)
      attributesForFaceting: [
        'searchable(online_category_l1_en)', // Category filter (searchable)
        'filterOnly(pr_active)',              // Stock status filter
      ],

      // Attributes to highlight in search results
      attributesToHighlight: [
        'pr_engname',
        'content_en',
        'online_category_l1_en',
      ],

      // Attributes to retrieve in search results
      attributesToRetrieve: [
        'objectID',
        'pr_engname',
        'online_category_l1_en',
        'ba_nprice',
        'pr_active',
        'content_en',
      ],

      // Ranking criteria - order matters!
      ranking: [
        'typo',        // Typo tolerance
        'geo',         // Geographic proximity (if applicable)
        'words',       // Number of matching words
        'filters',     // Filter matches
        'proximity',   // Word proximity
        'attribute',   // Attribute order (based on searchableAttributes)
        'exact',       // Exact matches
        'custom',      // Custom ranking
      ],

      // Custom ranking - can be used for popularity, price, etc.
      // customRanking: ['desc(popularity)', 'asc(ba_nprice)'],

      // Typo tolerance settings
      typoTolerance: true,
      minWordSizefor1Typo: 4,
      minWordSizefor2Typos: 8,
      allowTyposOnNumericTokens: false, // Don't allow typos on prices

      // Search mode - Neural/Semantic Search
      mode: 'neuralSearch', // Semantic search enabled
      semanticSearch: {
        eventSources: ['click', 'conversion'], // Event sources for learning from user behavior
      },

      // Query settings
      queryType: 'prefixLast', // Only last word is treated as prefix
      removeWordsIfNoResults: 'lastWords', // Remove words if no results
      advancedSyntax: false, // Keep simple for now

      // Pagination
      hitsPerPage: 20,
      paginationLimitedTo: 1000,

      // Highlighting
      highlightPreTag: '<mark>',
      highlightPostTag: '</mark>',

      // Language settings
      ignorePlurals: ['en'], // Treat singular/plural as same
      removeStopWords: false, // Keep stop words for better context

      // Distinct results (if needed for deduplication)
      // distinct: false,

      // Max facet values
      maxValuesPerFacet: 100,
      sortFacetValuesBy: 'count', // Sort facets by count

      // Response fields
      responseFields: ['*'], // Return all fields
    };

    const { taskID } = await index.setSettings(settings, {
      forwardToReplicas: false, // Set to true if you have replicas
    });

    console.log(`Settings update task created with ID: ${taskID}`);
    console.log('Waiting for task to complete...');

    await index.waitTask(taskID);

    console.log('✅ Index settings updated successfully!');
    console.log('\nUpdated settings:');
    console.log(JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('❌ Error updating index settings:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
    process.exit(1);
  }
}

// Run the update
updateIndexSettings();

