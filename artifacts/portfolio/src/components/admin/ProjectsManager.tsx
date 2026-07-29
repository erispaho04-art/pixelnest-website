import React, { useState } from 'react';
import { 
  useGetProjects, useCreateProject, useUpdateProject, 
  useDeleteProject, useReorderProjects, useRequestUploadUrl, 
  getGetProjectsQueryKey 
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { 
  DndContext, closestCenter, KeyboardSensor, PointerSensor, 
  useSensor, useSensors, DragEndEvent 
} from '@dnd-kit/core';
import { 
  arrayMove, SortableContext, sortableKeyboardCoordinates, 
  verticalListSortingStrategy, useSortable 
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Edit2, Plus, X, Loader2, Image as ImageIcon } from 'lucide-react';

const CATEGORIES = ["Branding", "Social Media", "Business Cards", "Menu Design", "Print Design", "Marketing"];

function SortableItem({ project, onEdit, onDelete }: any) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: project.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`flex items-center gap-4 p-4 bg-card border border-border rounded-lg ${isDragging ? 'shadow-2xl border-primary' : ''}`}>
      <button {...attributes} {...listeners} className="text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing p-1">
        <GripVertical className="w-5 h-5" />
      </button>
      
      <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0 bg-background flex items-center justify-center">
        {project.imageUrl ? (
          <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon className="w-6 h-6 text-muted-foreground" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-foreground truncate">{project.title}</h4>
        <span className="text-xs text-primary uppercase font-medium tracking-wider">{project.category}</span>
      </div>

      <div className="flex gap-2">
        <button onClick={() => onEdit(project)} className="p-2 text-muted-foreground hover:text-foreground bg-background rounded border border-border hover:border-foreground transition-all">
          <Edit2 className="w-4 h-4" />
        </button>
        <button onClick={() => onDelete(project.id)} className="p-2 text-destructive hover:bg-destructive hover:text-destructive-foreground rounded border border-border hover:border-destructive transition-all">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export function ProjectsManager() {
  const queryClient = useQueryClient();
  const { data: projects = [], isLoading } = useGetProjects();
  
  const create = useCreateProject();
  const update = useUpdateProject();
  const remove = useDeleteProject();
  const reorder = useReorderProjects();
  const requestUrl = useRequestUploadUrl();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  
  const [formData, setFormData] = useState({ title: '', description: '', category: CATEGORIES[0], imageUrl: '' });
  const [isUploading, setIsUploading] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = projects.findIndex((p) => p.id === active.id);
      const newIndex = projects.findIndex((p) => p.id === over.id);
      
      const newArray = arrayMove(projects, oldIndex, newIndex);
      queryClient.setQueryData(getGetProjectsQueryKey(), newArray);
      
      reorder.mutate({ data: { ids: newArray.map(p => p.id) } }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetProjectsQueryKey() })
      });
    }
  };

  const openNew = () => {
    setEditingProject(null);
    setFormData({ title: '', description: '', category: CATEGORIES[0], imageUrl: '' });
    setIsModalOpen(true);
  };

  const openEdit = (project: any) => {
    setEditingProject(project);
    setFormData({ title: project.title, description: project.description || '', category: project.category, imageUrl: project.imageUrl });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      remove.mutate({ id }, {
        onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetProjectsQueryKey() })
      });
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const { uploadURL, objectPath } = await requestUrl.mutateAsync({
        data: { name: file.name, size: file.size, contentType: file.type }
      });
      
      await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });
      
      setFormData(prev => ({ ...prev, imageUrl: objectPath }));
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProject) {
      update.mutate({ id: editingProject.id, data: formData }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetProjectsQueryKey() });
          setIsModalOpen(false);
        }
      });
    } else {
      create.mutate({ data: formData }, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: getGetProjectsQueryKey() });
          setIsModalOpen(false);
        }
      });
    }
  };

  if (isLoading) return <div className="animate-pulse h-96 bg-card rounded-xl"></div>;

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-serif font-bold mb-2">Projects</h2>
          <p className="text-muted-foreground">Manage your portfolio projects. Drag to reorder.</p>
        </div>
        <button onClick={openNew} className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center gap-2 font-medium transition-all shadow-lg shadow-primary/20">
          <Plus className="w-5 h-5" />
          Add Project
        </button>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={projects.map(p => p.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3">
            {projects.map((project) => (
              <SortableItem key={project.id} project={project} onEdit={openEdit} onDelete={handleDelete} />
            ))}
            {projects.length === 0 && (
              <div className="text-center py-16 text-muted-foreground bg-card border border-dashed border-border rounded-xl">
                No projects yet. Add your first one!
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-xl font-bold font-serif">{editingProject ? 'Edit Project' : 'New Project'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Title</label>
                <input required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-background border border-border rounded-md px-4 py-2 focus:border-primary outline-none transition-colors" placeholder="e.g. Niko's Brand Identity" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-background border border-border rounded-md px-4 py-2 focus:border-primary outline-none transition-colors">
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Description (Optional)</label>
                <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-background border border-border rounded-md px-4 py-2 focus:border-primary outline-none transition-colors" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Project Image</label>
                <div className="flex items-center gap-4">
                  {formData.imageUrl && (
                    <div className="w-20 h-20 rounded-md overflow-hidden border border-border flex-shrink-0">
                      <img src={formData.imageUrl} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 relative h-20 bg-background border border-border rounded-md border-dashed hover:border-primary transition-colors flex items-center justify-center group overflow-hidden">
                    <input type="file" accept="image/*" onChange={handleUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    {isUploading ? (
                      <Loader2 className="w-5 h-5 animate-spin text-primary" />
                    ) : (
                      <div className="text-center">
                        <span className="text-sm font-medium text-muted-foreground group-hover:text-primary block">Click to upload</span>
                        <span className="text-xs text-muted-foreground/70">JPG, PNG, WebP</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>
            
            <div className="p-6 border-t border-border flex justify-end gap-3 bg-background">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 font-medium border border-border rounded-md hover:bg-card transition-colors">Cancel</button>
              <button disabled={create.isPending || update.isPending || isUploading} onClick={handleSave} className="px-5 py-2.5 font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors flex items-center gap-2">
                {(create.isPending || update.isPending) && <Loader2 className="w-4 h-4 animate-spin" />} 
                {editingProject ? 'Save Changes' : 'Create Project'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}