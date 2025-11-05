import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NeaButton from '../ui/NeaButton';
import { Save, Code, Eye } from 'lucide-react';
import { EmailTemplate } from '@/api/entities';

export default function EmailTemplateEditor({ template, open, onOpenChange, onSave }) {
  const [editedTemplate, setEditedTemplate] = useState(template);

  useEffect(() => {
    setEditedTemplate(template);
  }, [template]);

  const handleSave = async () => {
    if (!editedTemplate?.id) return;
    await EmailTemplate.update(editedTemplate.id, editedTemplate);
    onSave();
    onOpenChange(false);
  };
  
  const handleInputChange = (e) => {
      const { name, value } = e.target;
      setEditedTemplate(prev => ({...prev, [name]: value}));
  };

  if (!editedTemplate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl bg-[#1a1a1a] border-[var(--nea-border-secondary)] text-white">
        <DialogHeader>
          <DialogTitle>Éditeur de Template E-mail</DialogTitle>
          <DialogDescription>
            Modification du template : <span className="font-bold text-white">{editedTemplate.template_name}</span> (<span className="font-mono text-xs text-gray-400">{editedTemplate.template_code}</span>)
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
            <div>
                <Label htmlFor="subject">Sujet de l'e-mail</Label>
                <Input id="subject" name="subject" value={editedTemplate.subject} onChange={handleInputChange} className="mt-1 bg-transparent" />
            </div>

            <Tabs defaultValue="html" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="html"><Code className="w-4 h-4 mr-2"/> Version HTML</TabsTrigger>
                    <TabsTrigger value="preview"><Eye className="w-4 h-4 mr-2"/> Prévisualisation</TabsTrigger>
                </TabsList>
                <TabsContent value="html" className="mt-4">
                    <Textarea 
                        name="html_content"
                        value={editedTemplate.html_content}
                        onChange={handleInputChange}
                        className="h-96 font-mono bg-black/30"
                        placeholder="<html>...</html>"
                    />
                </TabsContent>
                <TabsContent value="preview" className="mt-4">
                    <div className="h-96 border border-dashed border-gray-600 rounded-lg p-4 overflow-y-auto">
                        <div dangerouslySetInnerHTML={{ __html: editedTemplate.html_content }} />
                    </div>
                </TabsContent>
            </Tabs>
        </div>

        <DialogFooter>
          <NeaButton type="button" variant="secondary" onClick={() => onOpenChange(false)}>Annuler</NeaButton>
          <NeaButton type="submit" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Sauvegarder
          </NeaButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}