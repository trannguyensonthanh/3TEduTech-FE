import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { Level } from '@/services/level.service';

interface LevelDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  level: Level | null;
  onSubmit: (data: { name: string }) => void;
}

const LevelDialog: React.FC<LevelDialogProps> = ({
  open,
  onOpenChange,
  level,
  onSubmit,
}) => {
  const isEditing = !!level;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: level?.LevelName || '',
    },
  });

  React.useEffect(() => {
    if (open) {
      reset({
        name: level?.LevelName || '',
      });
    }
  }, [open, level, reset]);

  const onFormSubmit = (data: { name: string }) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-xl text-primary">
            {isEditing ? 'Edit Level' : 'Add New Level'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Level Name
            </Label>
            <Input
              id="name"
              {...register('name', { required: 'Level name is required' })}
              className="w-full"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto bg-primary hover:bg-primary/90"
            >
              {isEditing ? 'Update Level' : 'Add Level'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LevelDialog;
