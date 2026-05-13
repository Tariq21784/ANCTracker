// Corruption Perceptions Index (CPI) data for South Africa from Transparency International
const cpiData = {
    labels: ['2018', '2019', '2020', '2021', '2022', '2023', '2024'],
    datasets: [{
        label: 'CPI Score (0-100)',
        data: [43, 44, 44, 44, 43, 41, 41],
        borderColor: 'rgba(220, 53, 69, 1)',
        backgroundColor: 'rgba(220, 53, 69, 0.1)',
        tension: 0.4,
        fill: true
    }]
};

// Create the chart
const ctx = document.getElementById('cpiChart').getContext('2d');
const cpiChart = new Chart(ctx, {
    type: 'line',
    data: cpiData,
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'South Africa Corruption Perceptions Index (CPI) 2018-2024'
            },
            legend: {
                display: true,
                position: 'top'
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                min: 35,
                max: 50,
                title: {
                    display: true,
                    text: 'CPI Score (Higher = Less Corrupt)'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Year'
                }
            }
        },
        elements: {
            point: {
                radius: 6,
                hoverRadius: 8
            }
        }
    }
});

// Update indicators with 2024 data
document.getElementById('current-cpi').textContent = '41/100';
document.getElementById('rank').textContent = '81st out of 182 countries';
document.getElementById('trend').textContent = 'Stable (no change from 2023)';

// Fallback static news data
const fallbackNewsData = [
    {
        title: 'Public urged to comment on Reviewed White Paper on Local Government',
        summary: 'A second public consultation round for the local government white paper is underway, with civil society urged to share input on governance reforms.',
        date: 'May 2025',
        source: 'Corruption Watch',
        url: 'https://www.corruptionwatch.org.za/public-urged-to-comment-on-reviewed-white-paper-on-local-government/'
    },
    {
        title: 'Human rights provision fails when corruption is present',
        summary: 'Corruption Watch analysis highlights that corruption undermines delivery of human rights and weakens accountability systems in South Africa.',
        date: 'March 2025',
        source: 'Corruption Watch',
        url: 'https://www.corruptionwatch.org.za/human-rights-provision-fails-when-corruption-is-present/'
    },
    {
        title: 'State capture update: progress on govt response to Zondo recommendations',
        summary: 'Ongoing monitoring of government progress against the Zondo Commission recommendations remains critical for transparency and accountability.',
        date: '2025',
        source: 'Corruption Watch',
        url: 'https://www.corruptionwatch.org.za/state-capture-update-progress-on-govt-response-to-zondo-recommendations/'
    },
    {
        title: 'CW leads joint civil society submission on Protected Disclosures Bill',
        summary: 'Corruption Watch collaborates with civil society to strengthen whistleblower protections and ensure the bill supports corruption reporting.',
        date: '2024',
        source: 'Corruption Watch',
        url: 'https://www.corruptionwatch.org.za/cw-leads-joint-civil-society-submission-on-protected-disclosures-bill/'
    },
    {
        title: 'In the Still of Night – climate governance podcast, episode 4',
        summary: 'A new episode examines corruption risks in disaster relief and climate governance, highlighting accountability gaps in emergency response.',
        date: '2026',
        source: 'Corruption Watch',
        url: 'https://www.corruptionwatch.org.za/in-the-still-of-night-a-climate-governance-podcast-episode-4/'
    }
];

const RSS_FEED_URL = 'https://www.corruptionwatch.org.za/feed/';
let lastUpdateTime = null;

function formatDate(dateString) {
    try {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
        return dateString;
    }
}

function cleanHtml(html) {
    // Simple HTML tag removal for summaries
    return html.replace(/<[^>]*>/g, '').trim();
}

async function fetchRSSFeed() {
    try {
        const response = await fetch(RSS_FEED_URL, {
            mode: 'cors',
            headers: {
                'Accept': 'application/rss+xml, application/xml, text/xml'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

        const items = xmlDoc.querySelectorAll('item');
        const newsData = [];

        for (let i = 0; i < Math.min(items.length, 6); i++) {
            const item = items[i];
            const title = item.querySelector('title')?.textContent || 'No title';
            const description = cleanHtml(item.querySelector('description')?.textContent || '');
            const link = item.querySelector('link')?.textContent || item.querySelector('guid')?.textContent || '#';
            const pubDate = item.querySelector('pubDate')?.textContent || '';

            newsData.push({
                title: title,
                summary: description.length > 150 ? description.substring(0, 150) + '...' : description,
                date: formatDate(pubDate),
                source: 'Corruption Watch',
                url: link
            });
        }

        return newsData;
    } catch (error) {
        console.warn('Failed to fetch RSS feed:', error);
        return null;
    }
}

function renderNewsTracker(newsData, isLoading = false, error = null) {
    const list = document.getElementById('news-list');
    const latestDate = document.getElementById('latest-news-date');
    const loadingIndicator = document.getElementById('loading-indicator');

    if (!list || !latestDate || !loadingIndicator) return;

    // Clear existing content
    list.innerHTML = '';

    if (isLoading) {
        loadingIndicator.textContent = 'Fetching latest news...';
        loadingIndicator.className = 'loading';
        return;
    }

    if (error) {
        loadingIndicator.textContent = 'Unable to load latest news. Showing cached data.';
        loadingIndicator.className = 'error';
    } else {
        loadingIndicator.textContent = '';
        loadingIndicator.className = '';
    }

    if (newsData && newsData.length > 0) {
        newsData.forEach(item => {
            const card = document.createElement('div');
            card.className = 'news-item';
            card.innerHTML = `
                <h3><a href="${item.url}" target="_blank" rel="noopener noreferrer">${item.title}</a></h3>
                <p>${item.summary}</p>
                <small>${item.date} · ${item.source}</small>
            `;
            list.appendChild(card);
        });

        latestDate.textContent = newsData[0].date;
        lastUpdateTime = new Date();
    }
}

async function updateNewsTracker() {
    renderNewsTracker(null, true);

    let newsData = await fetchRSSFeed();

    if (!newsData) {
        // Fallback to static data
        newsData = fallbackNewsData;
    }

    renderNewsTracker(newsData, false, !await fetchRSSFeed());
}

// Initial load
updateNewsTracker();

// Auto-refresh every 10 minutes
setInterval(updateNewsTracker, 10 * 60 * 1000);