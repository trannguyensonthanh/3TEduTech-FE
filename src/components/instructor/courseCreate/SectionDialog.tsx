import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (title: string) => void;
  sectionTitle: string;
  setSectionTitle: (title: string) => void;
  isEditing: boolean;
}

const SectionDialog: React.FC<SectionDialogProps> = ({
  open,
  onClose,
  onSave,
  sectionTitle,
  setSectionTitle,
  isEditing,
}) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Section" : "Add New Section"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the section details below."
              : "Enter the details for your new section."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <label htmlFor="section-title">Section Title</label>
            <Input
              id="section-title"
              placeholder="e.g. Section 1: Introduction"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => onSave(sectionTitle)}
            disabled={!sectionTitle.trim()}
          >
            {isEditing ? "Update Section" : "Add Section"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SectionDialog;
