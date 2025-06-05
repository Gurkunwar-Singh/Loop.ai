const { v4: uuidv4 } = require('uuid');
const { enqueueBatches, processJobs } = require('./jobprocess');


const ingestionStore = new Map();
const jobQueue = [];

setInterval(() => processJobs(jobQueue, ingestionStore), 5000);

function handleIngest({ ids, priority }) {
    const ingestion_id = uuidv4();
    const batches = [];
    
    for (let i = 0; i < ids.length; i += 3) {
        const batch = {
            batch_id: uuidv4(),
            ids: ids.slice(i, i + 3),
            status: 'yet_to_start',
            created_at: new Date()
        };
        batches.push(batch);
        jobQueue.push({ ingestion_id, batch, priority, created_at: new Date() });
    }

    ingestionStore.set(ingestion_id, { status: 'yet_to_start', batches });
    return { ingestion_id };
}

function getStatus(ingestion_id) {
    const record = ingestionStore.get(ingestion_id);
    if (!record) return { error: "Not found" };

    const statuses = record.batches.map(b => b.status);
    if (statuses.every(s => s === 'yet_to_start')) record.status = 'yet_to_start';
    else if (statuses.every(s => s === 'completed')) record.status = 'completed';
    else record.status = 'triggered';

    return { ingestion_id, status: record.status, batches: record.batches };
}

module.exports = { handleIngest, getStatus };
