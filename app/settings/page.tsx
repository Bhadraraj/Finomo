"use client";

import { useEffect, useRef, useState } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useThemeStore, type Theme } from "@/lib/store";
import {
  Palette,
  Moon,
  Sun,
  Upload,
  Edit,
  Trash,
  Plus,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

/* ---------------- theme options ---------------- */
const themeOptions: { name: Theme; label: string; color: string }[] = [
  { name: "default", label: "Default Purple", color: "#8B5CF6" },
  { name: "ocean", label: "Ocean Blue", color: "#0EA5E9" },
  { name: "forest", label: "Forest Green", color: "#059669" },
  { name: "sunset", label: "Sunset Orange", color: "#EA580C" },
  { name: "royal", label: "Royal Purple", color: "#7C3AED" },
];

type BankAccount = {
  id: string;
  bank: string;
  last4: string;
  status: "Active" | "Inactive";
};

function Modal({
  open,
  onClose,
  title,
  children,
  footer,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative w-full max-w-md rounded-lg bg-sheet p-6 shadow-lg border">
        {title && <h3 className="text-lg font-semibold mb-3">{title}</h3>}
        <div className="max-h-[60vh] overflow-auto">{children}</div>
        {footer ? (
          <div className="mt-4 flex justify-end space-x-2">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}

/* ---------------- Settings Page ---------------- */
export default function SettingsPage() {
  const { theme, isDark, setTheme, toggleDark } = useThemeStore();
const inputRef = useRef<HTMLInputElement | null>(null);
  /* ---------- profile states ---------- */
  const [profilePhotoFile, setProfilePhotoFile] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(
    null
  );
  const [firstName, setFirstName] = useState<string>("Rajesh");
  const [lastName, setLastName] = useState<string>("Kumar");
  const [email, setEmail] = useState<string>("rajesh.kumar@email.com");
  const [phone, setPhone] = useState<string>("+91 98765 43210");
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  /* ---------- other states (copied from your original) ---------- */
  const [accounts, setAccounts] = useState<BankAccount[]>([
    { id: "hdfc", bank: "HDFC Bank", last4: "4521", status: "Active" },
    { id: "icici", bank: "ICICI Bank", last4: "7823", status: "Active" },
    { id: "axis", bank: "Axis Bank", last4: "2910", status: "Active" },
  ]);

  const [twoFactor, setTwoFactor] = useState<boolean>(false);
  const [notifications, setNotifications] = useState({
    emiReminders: true,
    refinancing: true,
    paymentConfirmations: true,
    creditScore: true,
    marketingEmails: false,
  });

  const [language, setLanguage] = useState<string>("en");

  /* ---------------- UI modal states ---------------- */
  const [addAccountOpen, setAddAccountOpen] = useState(false);
  const [removeAccountOpen, setRemoveAccountOpen] = useState<null | string>(
    null
  ); // id
  const [updatePwdOpen, setUpdatePwdOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  /* ---------------- form states ---------------- */
  const [newAccountBank, setNewAccountBank] = useState("");
  const [newAccountLast4, setNewAccountLast4] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /* ---------------- helpers ---------------- */
  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfilePhotoFile(file);
      setProfilePhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleProfilePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const max = 2 * 1024 * 1024; // 2MB
    if (file.size > max) {
      alert("File too large. Max size is 2MB.");
      e.currentTarget.value = ""; // clear selection
      return;
    }

    // revoke previous preview
    if (profilePhotoPreview) {
      URL.revokeObjectURL(profilePhotoPreview);
    }

    const url = URL.createObjectURL(file);
    setProfilePhotoFile(file);
    setProfilePhotoPreview(url);

    // If you want to auto-save/upload immediately, call upload function here.
    // uploadProfilePhoto(file);
  };
  const handleRemoveProfilePhoto = () => {
    setProfilePhotoFile(null);
    if (profilePhotoPreview) {
      URL.revokeObjectURL(profilePhotoPreview);
      setProfilePhotoPreview(null);
    }
  };

  /* add account via modal form */
  const handleAddAccountSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newAccountBank || !newAccountLast4) return;
    const id = `${newAccountBank
      .toLowerCase()
      .replace(/\s+/g, "-")}-${Date.now()}`;
    setAccounts((s) => [
      ...s,
      {
        id,
        bank: newAccountBank.trim(),
        last4: newAccountLast4.slice(-4),
        status: "Active",
      },
    ]);
    setNewAccountBank("");
    setNewAccountLast4("");
    setAddAccountOpen(false);
  };

  /* open remove modal (set id), confirm removal */
  const handleRemoveAccountConfirm = (id: string) => {
    setAccounts((s) => s.filter((a) => a.id !== id));
    setRemoveAccountOpen(null);
  };

  /* update password via modal with validation */
  const handleUpdatePasswordSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      return alert("Please fill all fields.");
    }
    if (newPassword.length < 8) {
      return alert("Password must be at least 8 characters.");
    }
    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match.");
    }
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setUpdatePwdOpen(false);
    window.setTimeout(() => {
      const el = document.createElement("div");
      el.className =
        "fixed bottom-6 right-6 bg-emerald-600 text-white px-4 py-2 rounded shadow";
      el.innerText = "Password updated";
      document.body.appendChild(el);
      setTimeout(() => document.body.removeChild(el), 2200);
    }, 200);
  };

  const handleDeleteAccountConfirm = () => {
    setDeleteOpen(false);
    setTimeout(() => {
      const el = document.createElement("div");
      el.className =
        "fixed bottom-6 right-6 bg-red-600 text-white px-4 py-2 rounded shadow";
      el.innerText = "Account deleted (demo)";
      document.body.appendChild(el);
      setTimeout(() => document.body.removeChild(el), 2200);
    }, 200);
  };

  const toggleNotification = (key: keyof typeof notifications) =>
    setNotifications((s) => ({ ...s, [key]: !s[key] }));

  useEffect(() => {
    // no-op: leave theme control entirely to useThemeStore
  }, [theme, isDark]);

  /* ---------- profile save (demo) ---------- */
  const handleSaveProfile = async (e?: React.FormEvent) => {
    e?.preventDefault();
    // Basic validation
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      return alert("Please fill name and email.");
    }
    setIsSavingProfile(true);

    // Simulate save/upload
    setTimeout(() => {
      setIsSavingProfile(false);
      const el = document.createElement("div");
      el.className =
        "fixed bottom-6 right-6 bg-emerald-600 text-white px-4 py-2 rounded shadow";
      el.innerText = "Profile saved";
      document.body.appendChild(el);
      setTimeout(() => document.body.removeChild(el), 2200);
    }, 900);
  };

  return (
    <Layout allowedRoles={["admin", "teacher", "parent"]}>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-lg font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Customize your school management system appearance and preferences.
          </p>
        </div>

        {/* ---------- Profile Settings (NEW) ---------- */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
              >
                <path
                  d="M12 12a4 4 0 100-8 4 4 0 000 8zm0 2c-4 0-8 2-8 6v1h16v-1c0-4-4-6-8-6z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
              </svg>
              <span>Profile Settings</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex items-start space-x-6">
                {/* avatar + upload */}
                <div className="flex-shrink-0">
                  <div className="relative w-24 h-24 rounded-md border bg-muted/5 flex items-center justify-center overflow-hidden">
                    {profilePhotoPreview ? (
                      <img
                        src={profilePhotoPreview}
                        alt="Profile"
                        className="object-contain w-full h-full"
                      />
                    ) : (
                      <div className="text-lg font-semibold text-foreground">
                        {`${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`}
                      </div>
                    )}
                  </div>

                  <div className="mt-3 flex items-center space-x-2">
                    <label>
                      <input
                        ref={inputRef}
                        type="file"
                        accept="image/png, image/jpeg, image/gif"
                        onChange={handleProfilePhotoChange}
                        className="sr-only"
                        aria-hidden
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => inputRef.current?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Change Photo
                      </Button>
                    </label>

                    {profilePhotoPreview && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          // remove preview and file immediately
                          setProfilePhotoFile(null);
                          if (profilePhotoPreview) {
                            URL.revokeObjectURL(profilePhotoPreview);
                            setProfilePhotoPreview(null);
                          }
                          // also clear the input so selecting same file again works
                          if (inputRef.current) inputRef.current.value = "";
                        }}
                        aria-label="Remove photo"
                      >
                        Remove
                      </Button>
                    )}
                  </div>

                  <p className="mt-2 text-xs text-muted-foreground">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>

                {/* fields */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label>First Name</Label>
                    <input
                      className="mt-2 block w-full rounded-md border px-3 py-2 bg-transparent"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label>Last Name</Label>
                    <input
                      className="mt-2 block w-full rounded-md border px-3 py-2 bg-transparent"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Label>Email</Label>
                    <input
                      type="email"
                      className="mt-2 block w-full rounded-md border px-3 py-2 bg-transparent"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <Label>Phone</Label>
                    <input
                      type="tel"
                      className="mt-2 block w-full rounded-md border px-3 py-2 bg-transparent"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSavingProfile}>
                  {isSavingProfile ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Theme Card (moved below Profile) */}
        

        {/* Linked Bank Accounts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between w-full">
              <span>Linked Bank Accounts</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAddAccountOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" /> Add Account
              </Button>
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {accounts.map((acc) => (
                <div key={acc.id} className="flex items-center justify-between">
                  {/* Left: avatar + bank info + small badge */}
                  <div className="flex items-center space-x-3">
                    {/* Avatar / initials */}
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-slate-800 flex items-center justify-center text-sm font-medium text-gray-700 dark:text-gray-200">
                      {acc.bank
                        .split(" ")
                        .slice(0, 2)
                        .map((p) => p[0])
                        .join("")}
                    </div>

                    {/* Bank name + small badge + last4 */}
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-foreground">
                          {acc.bank}
                        </p>

                        <span
                          className={`
                  inline-flex items-center text-[11px] px-2 py-0.5 rounded-full font-medium
                  ${
                    acc.status === "Active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-700"
                  }
                `}
                          aria-hidden="true"
                          title={acc.status}
                        >
                          {acc.status === "Active" ? "active" : "inactive"}
                        </span>
                      </div>

                      <p className="text-xs text-muted-foreground">
                        ****{acc.last4}
                      </p>
                    </div>
                  </div>

                  {/* Right: edit / delete buttons */}
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label={`Edit ${acc.bank} account`}
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-600"
                      aria-label={`Delete ${acc.bank} account`}
                      title="Delete"
                      onClick={() => setRemoveAccountOpen(acc.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle>Security</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Current Password</Label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="mt-2 block w-full rounded-md border px-3 py-2 bg-transparent"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="new-password"
                  name="current-password"
                />
              </div>

              <div>
                <Label>New Password</Label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  className="mt-2 block w-full rounded-md border px-3 py-2 bg-transparent"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <div className="sm:col-span-2">
                <Label>Confirm New Password</Label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  className="mt-2 block w-full rounded-md border px-3 py-2 bg-transparent"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                <Button size="sm" onClick={() => setUpdatePwdOpen(true)}>
                  Update Password
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">EMI Reminders</p>
                <p className="text-sm text-muted-foreground">
                  Get notified 3 days before EMI due date
                </p>
              </div>
              <Switch
                checked={notifications.emiReminders}
                onCheckedChange={() => toggleNotification("emiReminders")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Refinancing Opportunities</p>
                <p className="text-sm text-muted-foreground">
                  New offers matching your profile
                </p>
              </div>
              <Switch
                checked={notifications.refinancing}
                onCheckedChange={() => toggleNotification("refinancing")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Payment Confirmations</p>
                <p className="text-sm text-muted-foreground">
                  Instant alerts on successful payments
                </p>
              </div>
              <Switch
                checked={notifications.paymentConfirmations}
                onCheckedChange={() =>
                  toggleNotification("paymentConfirmations")
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Credit Score Updates</p>
                <p className="text-sm text-muted-foreground">
                  Monthly credit score change notifications
                </p>
              </div>
              <Switch
                checked={notifications.creditScore}
                onCheckedChange={() => toggleNotification("creditScore")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Marketing Emails</p>
                <p className="text-sm text-muted-foreground">
                  Product updates and tips
                </p>
              </div>
              <Switch
                checked={notifications.marketingEmails}
                onCheckedChange={() => toggleNotification("marketingEmails")}
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Language</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center justify-between">
              <Label className="mr-4">Select Language</Label>

              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-48 rounded-md border px-3 py-2 bg-transparent text-foreground"
              >
                <option value="en">English</option>
                <option value="hi">Hindi</option>
                <option value="ta">Tamil</option>
                <option value="bn">Bengali</option>
              </select>
            </div>
          </CardContent>
        </Card>
<Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Palette className="w-5 h-5" />
              <span>Theme Customization</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Dark/Light Mode Toggle */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Theme Mode</Label>

                <p className="text-sm text-muted-foreground">
                  Switch between light and dark themes
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Sun className="w-4 h-4 text-muted-foreground" />
                <Switch checked={isDark} onCheckedChange={toggleDark} />
                <Moon className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>

            {/* Color Theme Selection */}
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium">Color Theme</Label>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {themeOptions.map((option) => (
                  <button
                    key={option.name}
                    onClick={() => setTheme(option.name)}
                    className={cn(
                      "p-2 rounded-md border-2 transition-all duration-200 text-left",
                      theme === option.name
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                        style={{ backgroundColor: option.color }}
                      />
                      <div>
                        <p className="font-medium text-sm text-foreground">
                          {option.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {option.color}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Danger Zone */}
        <Card>
          <CardHeader>
            <CardTitle>Danger Zone</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Delete Account — Permanently delete your account and all data.
              </p>
              <div className="flex items-center space-x-3">
                <Button
                  variant="destructive"
                  onClick={() => setDeleteOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Trash className="w-4 h-4" />
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ---------- Add Account Modal ---------- */}
      <Modal
        open={addAccountOpen}
        onClose={() => setAddAccountOpen(false)}
        title="Add Bank Account"
        footer={
          <>
            <Button variant="ghost" onClick={() => setAddAccountOpen(false)}>
              Cancel
            </Button>
            <Button onClick={(e) => handleAddAccountSubmit(e as any)}>
              Add
            </Button>
          </>
        }
      >
        <form onSubmit={(e) => handleAddAccountSubmit(e)}>
          <Label className="block">Bank Name</Label>
          <input
            className="mt-2 block w-full rounded-md border px-3 py-2 bg-transparent"
            value={newAccountBank}
            onChange={(e) => setNewAccountBank(e.target.value)}
            placeholder="e.g. HDFC Bank"
            required
          />

          <Label className="block mt-4">Last 4 digits</Label>
          <input
            className="mt-2 block w-32 rounded-md border px-3 py-2 bg-transparent"
            value={newAccountLast4}
            onChange={(e) =>
              setNewAccountLast4(e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            placeholder="4521"
            required
          />
        </form>
      </Modal>

      {/* ---------- Remove Account Modal ---------- */}
      <Modal
        open={!!removeAccountOpen}
        onClose={() => setRemoveAccountOpen(null)}
        title="Remove Linked Account"
        footer={
          <>
            <Button variant="ghost" onClick={() => setRemoveAccountOpen(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() =>
                removeAccountOpen &&
                handleRemoveAccountConfirm(removeAccountOpen)
              }
            >
              Remove
            </Button>
          </>
        }
      >
        <p>Are you sure you want to remove this linked bank account?</p>
      </Modal>

      {/* ---------- Update Password Modal ---------- */}
      <Modal
        open={updatePwdOpen}
        onClose={() => setUpdatePwdOpen(false)}
        title="Update Password"
        footer={
          <>
            <Button variant="ghost" onClick={() => setUpdatePwdOpen(false)}>
              Cancel
            </Button>
            <Button onClick={(e) => handleUpdatePasswordSubmit(e as any)}>
              Update
            </Button>
          </>
        }
      >
        <form onSubmit={(e) => handleUpdatePasswordSubmit(e)}>
          <Label>Current Password</Label>
          <input
            type="password"
            className="mt-2 block w-full rounded-md border px-3 py-2 bg-transparent"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
          <Label className="mt-4">New Password</Label>
          <input
            type="password"
            className="mt-2 block w-full rounded-md border px-3 py-2 bg-transparent"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            minLength={8}
            required
          />
          <Label className="mt-4">Confirm New Password</Label>
          <input
            type="password"
            className="mt-2 block w-full rounded-md border px-3 py-2 bg-transparent"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            minLength={8}
            required
          />
        </form>
      </Modal>

      {/* ---------- Delete Account Modal ---------- */}
      <Modal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete Account"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteAccountConfirm}>
              Delete
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">
          This action will permanently delete your account and all associated
          data. This cannot be undone.
        </p>
      </Modal>
    </Layout>
  );
}
