'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Eye, CreditCard as Edit, Plus, Trash2, Users, BookOpen, Calendar, DollarSign, Chrome as Home, Bus, Bell, Settings, FileText, GraduationCap, CircleCheck as CheckCircle2 } from 'lucide-react';

interface Permission {
  module: string;
  canView: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
}

interface PermissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: any;
  onSave: (permissions: Permission[]) => void;
}

const modules = [
  { id: 'dashboard', name: 'Dashboard', icon: Home, color: 'text-blue-600' },
  { id: 'students', name: 'Students', icon: Users, color: 'text-green-600' },
  { id: 'teachers', name: 'Teachers', icon: GraduationCap, color: 'text-violet-600' },
  { id: 'classes', name: 'Classes', icon: BookOpen, color: 'text-orange-600' },
  { id: 'subjects', name: 'Subjects', icon: FileText, color: 'text-cyan-600' },
  { id: 'timetable', name: 'Timetable', icon: Calendar, color: 'text-pink-600' },
  { id: 'attendance', name: 'Attendance', icon: CheckCircle2, color: 'text-emerald-600' },
  { id: 'exams', name: 'Exams', icon: FileText, color: 'text-red-600' },
  { id: 'library', name: 'Library', icon: BookOpen, color: 'text-indigo-600' },
  { id: 'hostel', name: 'Hostel', icon: Home, color: 'text-amber-600' },
  { id: 'transport', name: 'Transport', icon: Bus, color: 'text-teal-600' },
  { id: 'fees', name: 'Fees & Accounts', icon: DollarSign, color: 'text-green-600' },
  { id: 'notices', name: 'Notices', icon: Bell, color: 'text-yellow-600' },
  { id: 'settings', name: 'Settings', icon: Settings, color: 'text-gray-600' },
];

const defaultPermissions: Record<string, Partial<Record<string, boolean>>> = {
  admin: {
    dashboard: true,
    students: true,
    teachers: true,
    classes: true,
    subjects: true,
    timetable: true,
    attendance: true,
    exams: true,
    library: true,
    hostel: true,
    transport: true,
    fees: true,
    notices: true,
    settings: true,
  },
  teacher: {
    dashboard: true,
    students: true,
    classes: true,
    subjects: true,
    timetable: true,
    attendance: true,
    exams: true,
    notices: true,
  },
  librarian: {
    dashboard: true,
    library: true,
    students: true,
    notices: true,
  },
  hostel_admin: {
    dashboard: true,
    hostel: true,
    students: true,
    notices: true,
  },
  accountant: {
    dashboard: true,
    fees: true,
    students: true,
    notices: true,
  },
};

export default function PermissionModal({ open, onOpenChange, user, onSave }: PermissionModalProps) {
  const [permissions, setPermissions] = useState<Permission[]>([]);

  useEffect(() => {
    if (user) {
      const userRole = user.role;
      const roleDefaults = defaultPermissions[userRole] || {};

      const initialPermissions = modules.map((module) => {
        const hasAccess = roleDefaults[module.id] || false;
        return {
          module: module.id,
          canView: hasAccess,
          canCreate: hasAccess && userRole !== 'parent',
          canEdit: hasAccess && userRole !== 'parent',
          canDelete: hasAccess && (userRole === 'admin'),
        };
      });

      setPermissions(user.permissions || initialPermissions);
    }
  }, [user]);

  const handleToggle = (moduleId: string, permission: keyof Omit<Permission, 'module'>) => {
    setPermissions((prev) =>
      prev.map((perm) => {
        if (perm.module === moduleId) {
          const updated = { ...perm, [permission]: !perm[permission] };

          if (permission === 'canView' && !updated.canView) {
            updated.canCreate = false;
            updated.canEdit = false;
            updated.canDelete = false;
          }

          if ((permission === 'canCreate' || permission === 'canEdit' || permission === 'canDelete') && updated[permission]) {
            updated.canView = true;
          }

          return updated;
        }
        return perm;
      })
    );
  };

  const handleSave = () => {
    onSave(permissions);
  };

  const handleSelectAll = () => {
    setPermissions((prev) =>
      prev.map((perm) => ({
        ...perm,
        canView: true,
        canCreate: true,
        canEdit: true,
        canDelete: true,
      }))
    );
  };

  const handleDeselectAll = () => {
    setPermissions((prev) =>
      prev.map((perm) => ({
        ...perm,
        canView: false,
        canCreate: false,
        canEdit: false,
        canDelete: false,
      }))
    );
  };

  const getModuleInfo = (moduleId: string) => {
    return modules.find((m) => m.id === moduleId);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Manage Permissions: {user?.name}
              </DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Configure module access and permissions for this user
              </p>
            </div>
            {user && (
              <Badge className={`${
                user.role === 'admin' ? 'bg-red-100 text-red-700' :
                user.role === 'teacher' ? 'bg-blue-100 text-blue-700' :
                'bg-green-100 text-green-700'
              }`}>
                {user.role.toUpperCase().replace('_', ' ')}
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Permissions control what actions a user can perform in each module.
              View-only access allows reading data, while other permissions enable modifications.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={handleSelectAll}>
              Select All
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleDeselectAll}>
              Deselect All
            </Button>
          </div>

          <div className="space-y-3">
            {modules.map((module) => {
              const perm = permissions.find((p) => p.module === module.id);
              const ModuleIcon = module.icon;

              if (!perm) return null;

              return (
                <Card key={module.id} className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`${module.color} mt-1`}>
                      <ModuleIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <div>
                        <h4 className="font-semibold text-card-foreground">{module.name}</h4>
                        <p className="text-xs text-muted-foreground">
                          Configure access and permissions for {module.name.toLowerCase()} module
                        </p>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-muted-foreground" />
                            <Label htmlFor={`${module.id}-view`} className="text-sm">
                              View
                            </Label>
                          </div>
                          <Switch
                            id={`${module.id}-view`}
                            checked={perm.canView}
                            onCheckedChange={() => handleToggle(module.id, 'canView')}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Plus className="w-4 h-4 text-muted-foreground" />
                            <Label htmlFor={`${module.id}-create`} className="text-sm">
                              Create
                            </Label>
                          </div>
                          <Switch
                            id={`${module.id}-create`}
                            checked={perm.canCreate}
                            onCheckedChange={() => handleToggle(module.id, 'canCreate')}
                            disabled={!perm.canView}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Edit className="w-4 h-4 text-muted-foreground" />
                            <Label htmlFor={`${module.id}-edit`} className="text-sm">
                              Edit
                            </Label>
                          </div>
                          <Switch
                            id={`${module.id}-edit`}
                            checked={perm.canEdit}
                            onCheckedChange={() => handleToggle(module.id, 'canEdit')}
                            disabled={!perm.canView}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Trash2 className="w-4 h-4 text-muted-foreground" />
                            <Label htmlFor={`${module.id}-delete`} className="text-sm">
                              Delete
                            </Label>
                          </div>
                          <Switch
                            id={`${module.id}-delete`}
                            checked={perm.canDelete}
                            onCheckedChange={() => handleToggle(module.id, 'canDelete')}
                            disabled={!perm.canView}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Permissions
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
