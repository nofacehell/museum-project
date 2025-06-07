const handleDelete = async (id, type) => {
  console.log(`Deleting ${type} with id ${id}`);
  
  const confirmed = window.confirm(`Вы уверены, что хотите удалить этот ${type}?`);
  if (!confirmed) return;

  // Special case for Nokia 3310 - remove the block condition
  // Let's remove this special case block that's preventing deletion
  /*
  // Check if this is Nokia 3310 - special case
  if (type === 'exhibit' && exhibits.find(e => e.id === id && e.title.includes('Nokia 3310'))) {
    UIkit.notification({
      message: 'Этот экспонат невозможно удалить из-за настроек доступа',
      status: 'warning',
      pos: 'top-center',
      timeout: 3000
    });
    return;
  }
  */
  
  setDeletingItems(prev => ({
    ...prev,
    [id]: true
  }));
} 