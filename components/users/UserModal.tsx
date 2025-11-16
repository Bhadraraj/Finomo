'use client';

import { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { User, Mail, Phone, Shield, KeyRound } from 'lucide-react';

const userSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  role: z.enum(['admin', 'teacher', 'hostel_admin', 'librarian', 'accountant'], {
    message: 'Please select a role',
  }),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  isActive: z.boolean(),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: any;
  onSave: (data: UserFormData) => void;
}

const roleOptions = [
  { value: 'admin', label: 'Administrator', description: 'Full system access' },
  { value: 'teacher', label: 'Teacher', description: 'Manage classes and students' },
  { value: 'hostel_admin', label: 'Hostel Admin', description: 'Manage hostel operations' },
  { value: 'librarian', label: 'Librarian', description: 'Manage library' },
  { value: 'accountant', label: 'Accountant', description: 'Manage accounts and fees' },
];

export default function UserModal({ open, onOpenChange, user, onSave }: UserModalProps) {
  const isEdit = !!user;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      role: 'teacher',
      password: '',
      isActive: true,
    },
  });

  useEffect(() => {
    if (user) {
      setValue('name', user.name);
      setValue('email', user.email);
      setValue('phone', user.phone);
      setValue('role', user.role);
      setValue('isActive', user.isActive);
    } else {
      reset({
        name: '',
        email: '',
        phone: '',
        role: 'teacher',
        password: '',
        isActive: true,
      });
    }
  }, [user, reset, setValue]);

  const onSubmit = (data: UserFormData) => {
    onSave(data);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {isEdit ? 'Edit User' : 'Add New User'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="name"
                  placeholder="Enter full name"
                  {...register('name')}
                  className="pl-10"
                />
              </div>
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@school.edu"
                  {...register('email')}
                  className="pl-10"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  id="phone"
                  placeholder="+1234567890"
                  {...register('phone')}
                  className="pl-10"
                />
              </div>
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      {roleOptions.map((role) => (
                        <SelectItem key={role.value} value={role.value}>
                          <div className="flex flex-col">
                            <span className="font-medium">{role.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {role.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.role && (
                <p className="text-sm text-destructive">{errors.role.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">
              {isEdit ? 'New Password (leave empty to keep current)' : 'Password *'}
            </Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="password"
                type="password"
                placeholder={isEdit ? 'Enter new password' : 'Enter password'}
                {...register('password')}
                className="pl-10"
              />
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Password must be at least 6 characters long
            </p>
          </div>

          <div className="flex items-center justify-between p-4 bg-accent/50 rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="isActive" className="text-base">
                Account Status
              </Label>
              <p className="text-sm text-muted-foreground">
                {isEdit ? 'User can access the system when active' : 'Activate user account immediately'}
              </p>
            </div>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Switch
                  id="isActive"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-blue-900 mb-1">
                  Default Permissions
                </h4>
                <p className="text-xs text-blue-700">
                  Default module permissions will be assigned based on the selected role.
                  You can customize permissions after creating the user.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                reset();
              }}
            >
              Cancel
            </Button>
            <Button type="submit">
              {isEdit ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
