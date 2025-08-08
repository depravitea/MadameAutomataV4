export const Buttons = {
  accept: (id:string)=>`pending:accept:${id}`,
  decline:(id:string)=>`pending:decline:${id}`
};
export const parsePendingButton = (customId: string) => {
  const [p, action, id] = customId.split(':');
  if (p !== 'pending') return null;
  if (!['accept','decline'].includes(action)) return null;
  return { action, id };
};
