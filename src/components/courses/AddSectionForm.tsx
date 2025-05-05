import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface AddSectionFormProps {
  onAddSection: (title: string, description: string) => void;
}

const AddSectionForm: React.FC<AddSectionFormProps> = ({ onAddSection }) => {
  const [newSectionTitle, setNewSectionTitle] = useState("");
  const [newSectionDescription, setNewSectionDescription] = useState("");

  const handleAddSection = () => {
    if (!newSectionTitle.trim()) return;
    onAddSection(newSectionTitle, newSectionDescription);
    setNewSectionTitle("");
    setNewSectionDescription("");
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Add New Section</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="new-section-title">Section Title</Label>
            <Input
              id="new-section-title"
              placeholder="Enter section title"
              value={newSectionTitle}
              onChange={(e) => setNewSectionTitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="new-section-description">
              Description (optional)
            </Label>
            <Textarea
              id="new-section-description"
              placeholder="Enter section description"
              value={newSectionDescription}
              onChange={(e) => setNewSectionDescription(e.target.value)}
              rows={3}
            />
          </div>
          <Button onClick={handleAddSection}>
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AddSectionForm;
