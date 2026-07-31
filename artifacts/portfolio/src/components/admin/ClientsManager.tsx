import React, { useState } from 'react';
import {
  useGetClients, useCreateClient, useUpdateClient,
  useDeleteClient, useReorderClients, useRequestUploadUrl,
  getGetClientsQueryKey,
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor,
  useSensor, useSensors, type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  verticalListSortingStrategy, useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Edit2, Plus, X, Loader2, Image as ImageIcon, Star } from 'lucide-react';

function SortableItem({ client, onEdit, onDelete }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: client.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-4 p-4 bg-card border border-border rounded-lg ${isDragging ? 'shadow-2xl border-primary' : ''}`}
    >
      <button {...attributes} {...listeners} className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing p-1">
        <GripVertical className="w-5 h-5" />
      </button>

      <div className="w-16 h-12 rounded overflow-hidden flex-shrink-0 bg-background flex items-center justify-center border border-border">
        {client.logoUrl ? (
          <img src={client.logoUrl} alt={client.name} className="w-full h-full object-contain p-1" />
        ) : (
          <ImageIcon className="w-5 h-5 text-muted-foreground" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-foreground truncate">{client.name}</h4>
          {client.featured && <Star className="w-3 h-3 text-primary fill-primary flex-shrink-0" />}
        </div>
        {client.website && (
          <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary truncate block">
            {client.website}
          </a>
        )}
      </div>

      <div className="flex gap-2">
        <button onClick={() => onEdit(client)} className="p-2 text-muted-foreground hover:text-foreground bg-background rounded border border-border hover:border-foreground transition-all">
          <Edit2 className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(client.id)} className="p-2 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded border border-border hover:border-destructive transition-all">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function ClientsManager() {
  const queryClient = useQueryClient();
  const { data: clients = [], isLoading } = useGetClients();

  const create = useCreateClient();
  const update = useUpdateClient();
  const remove = useDeleteClient();
  const reorder = useReorderClients();
  const requestUrl = useRequestUploadUrl();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', logoUrl: '', website: '', featured: false });
  const [isUploading, setIsUploading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = clients.findIndex(c => c.id === active.id);
      const newIndex = clients.findIndex(c => c.id === over.id);
      const newArray = arrayMove(clients, oldIndex, newIndex);
      queryClient.setQueryData(getGetClientsQueryKey(), newArray);
      reorder.mutate(
        { data: { ids: newArray.map(c => c.id) } },
        { onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetClientsQueryKey() }) },
      );
    }
  };

  const openNew = () => {
    setEditingClient(null);
    setFormData({ name: '', logoUrl: '', website: '', featured: false });
    setIsModalOpen(true);
  };

  const openEdit = (client: any) => {
    setEditingClient(client);
    setFormData({ name: client.name, logoUrl: client.logoUrl, website: client.website || '', featured: client.featured });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Delete this client?')) {
      remove.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetClientsQueryKey() }),
      });
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploading(true);
      const { uploadURL, objectPath } = await requestUrl.mutateAsync({
        data: { name: file.name, size: file.size, contentType: file.type },
      });
      await fetch(uploadURL, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
      const logoUrl = `/api/storage${objectPath}`;
      setFormData(prev => ({ ...prev, logoUrl }));
    } catch (err) {
      console.error('Logo upload failed', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: formData.name,
      logoUrl: formData.logoUrl,
      website: formData.website || undefined,
      featured: formData.featured,
    };
    if (editingClient) {
      update.mutate({ id: editingClient.id, data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetClientsQueryKey() });
          setIsModalOpen(false);
        },
      });
    } else {
      create.mutate({ data }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetClientsQueryKey() });
          setIsModalOpen(false);
        },
      });
    }
  };

  if (isLoading) return <div className="animate-pulse h-96 bg-card rounded-xl" />;

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold mb-2">Client Logos</h2>
          <p className="text-muted-foreground">Manage the "Trusted by Businesses" section. Drag to reorder.</p>
        </div>
        <button onClick={openNew} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2 font-medium transition-all shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5" />
          Add Client
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={clients.map(c => c.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {clients.map(client => (
              <SortableItem key={client.id} client={client} onEdit={openEdit} onDelete={handleDelete} />
            ))}
            {clients.length === 0 && (
              <div className="text-center py-16 text-muted-foreground bg-card border border-dashed border-border rounded-xl">
                No clients yet. Add your first one!
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-xl font-bold font-serif">{editingClient ? 'Edit Client' : 'New Client'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Company Name</label>
                <input
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-background border border-border rounded-md px-4 py-2 focus:border-primary outline-none transition-colors"
                  placeholder="e.g. Acme Corp"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Website (Optional)</label>
                <input
                  value={formData.website}
                  onChange={e => setFormData({ ...formData, website: e.target.value })}
                  className="w-full bg-background border border-border rounded-md px-4 py-2 focus:border-primary outline-none transition-colors"
                  placeholder="https://example.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Company Logo</label>
                <div className="flex items-center gap-4">
                  {formData.logoUrl && (
                    <div className="w-20 h-12 rounded border border-border flex-shrink-0 flex items-center justify-center bg-background">
                      <img src={formData.logoUrl} className="max-w-full max-h-full object-contain p-1" alt="logo" />
                    </div>
                  )}
                  <div className="flex-1 relative h-16 bg-background border border-dashed border-border rounded-md hover:border-primary transition-colors flex items-center justify-center group overflow-hidden">
                    <input type="file" accept="image/*" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    {isUploading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    ) : (
                      <span className="text-sm text-muted-foreground group-hover:text-primary">Click to upload</span>
                    )}
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={e => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded border border-border accent-primary"
                />
                <span className="text-sm font-medium">Featured client</span>
              </label>
            </form>

            <div className="p-6 border-t border-border flex justify-end gap-3 bg-background">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 font-medium border border-border rounded-md hover:bg-card transition-colors">Cancel</button>
              <button
                disabled={create.isPending || update.isPending || isUploading}
                onClick={handleSave}
                className="px-5 py-2.5 font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2"
              >
                {(create.isPending || update.isPending) && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingClient ? 'Save Changes' : 'Create Client'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
