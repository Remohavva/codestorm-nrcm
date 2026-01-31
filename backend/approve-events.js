const { supabaseAdmin } = require('./src/utils/supabase');

async function approveAllPendingEvents() {
  try {
    console.log('🔄 Approving all pending events...');

    // Get all pending events
    const { data: events, error: fetchError } = await supabaseAdmin
      .from('events')
      .select('id, title, status')
      .eq('status', 'pending');

    if (fetchError) {
      console.error('Error fetching events:', fetchError);
      return;
    }

    console.log(`Found ${events.length} pending events`);

    // Approve all pending events
    const { data: updatedEvents, error: updateError } = await supabaseAdmin
      .from('events')
      .update({ status: 'approved' })
      .eq('status', 'pending')
      .select();

    if (updateError) {
      console.error('Error updating events:', updateError);
      return;
    }

    console.log(`✅ Successfully approved ${updatedEvents.length} events:`);
    updatedEvents.forEach(event => {
      console.log(`  - ${event.title}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run if called directly
if (require.main === module) {
  approveAllPendingEvents();
}

module.exports = { approveAllPendingEvents };