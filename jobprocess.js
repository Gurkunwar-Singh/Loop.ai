function processJobs(queue, store) {
    if (queue.length === 0) return;

    // Sort by priority and time
    queue.sort((a, b) => {
        const priorityOrder = { HIGH: 0, MEDIUM: 1, LOW: 2 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        return a.created_at - b.created_at;
    });

    // 1 batch per 5 seconds
    const jobsToRun = queue.splice(0, 1);

    jobsToRun.forEach(job => {
        const { ingestion_id, batch } = job;
        batch.status = 'triggered';

        setTimeout(() => {
            batch.status = 'completed';
            batch.processed_at = new Date().toISOString();

            console.log(`✅ Processed batch ${batch.batch_id} at ${batch.processed_at}`);

            const record = store.get(ingestion_id);
            if (record) {
                const idx = record.batches.findIndex(b => b.batch_id === batch.batch_id);
                record.batches[idx] = batch;
            }
        }, 3000); // Simulated external API processing delay
    });
}

module.exports = { processJobs };
