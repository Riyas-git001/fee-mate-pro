import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { GraduationCap, User, Phone, Building2 } from "lucide-react";

interface OnboardingFormProps {
  onSubmit: (data: { name: string; phone: string; department: string }) => void;
}

export const OnboardingForm = ({ onSubmit }: OnboardingFormProps) => {
  const [formData, setFormData] = useState({ name: "", phone: "", department: "" });
  const [countryCode, setCountryCode] = useState("+91");
  const [errors, setErrors] = useState<{ name?: string; phone?: string; department?: string }>({});
  const [isLoading, setIsLoading] = useState(false);

  // Real-time validation
  const validatePhone = (phone: string): string | undefined => {
    if (!phone) return "Phone number is required";
    if (!/^\d{10}$/.test(phone)) return "Phone number must be exactly 10 digits";
    return undefined;
  };

  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return "Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    return undefined;
  };

  const validateDepartment = (department: string): string | undefined => {
    if (!department) return "Department is required";
    return undefined;
  };

  const handleInputChange = (field: 'name' | 'phone' | 'department', value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation
    const newErrors = { ...errors };
    if (field === 'phone') {
      const phoneError = validatePhone(value);
      if (phoneError) newErrors.phone = phoneError;
      else delete newErrors.phone;
    } else if (field === 'name') {
      const nameError = validateName(value);
      if (nameError) newErrors.name = nameError;
      else delete newErrors.name;
    } else if (field === 'department') {
      const departmentError = validateDepartment(value);
      if (departmentError) newErrors.department = departmentError;
      else delete newErrors.department;
    }
    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const nameError = validateName(formData.name);
    const phoneError = validatePhone(formData.phone);
    const departmentError = validateDepartment(formData.department);
    
    if (nameError || phoneError || departmentError) {
      setErrors({ name: nameError, phone: phoneError, department: departmentError });
      return;
    }

    setIsLoading(true);
    fetch('https://script.google.com/macros/s/AKfycbxvyqJ78oah9zoxLxVKZiRTEOxNVyEEmvN-PzVaReSXVreIww2nqLcBWZ31gIs-QSIU/exec', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        name: formData.name,
        phone: `${countryCode}${formData.phone}`,
        department: formData.department
      })
    })
      .then(response => response.text())
      .then(result => {
        setIsLoading(false);
        // Optionally, handle the result (show a message, etc.)
        onSubmit({
          ...formData,
          phone: `${countryCode}${formData.phone}`
        });
      })
      .catch(error => {
        setIsLoading(false);
        alert('Error submitting form: ' + error);
      });
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute top-10 right-10 w-32 h-32 opacity-10 bg-contain bg-no-repeat"
          style={{ backgroundImage: "url('/lovable-uploads/d78c4b7b-23b9-40d4-9e3d-666386fe827e.png')" }}
        />
        <div 
          className="absolute bottom-0 left-0 w-full h-48 opacity-20 bg-contain bg-no-repeat bg-center"
          style={{ backgroundImage: "url('/lovable-uploads/9dfd99c1-825d-4125-bfad-91f59bf80be6.png')" }}
        />
      </div>
      
      <Card className="w-full max-w-md shadow-xl border-0 bg-card/90 backdrop-blur-sm relative z-10">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
            <img 
              src="/lovable-uploads/thejus-logo.png" 
              alt="Thejus Engineering College Logo" 
              className="w-16 h-16 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div 
              className="w-16 h-16 hidden items-center justify-center bg-gradient-to-r from-blue-600 to-red-600 rounded-full text-white font-bold text-xl"
              style={{ display: 'none' }}
            >
              TEC
            </div>
          </div>
          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold text-primary">
              THEJUS ENGINEERING COLLEGE
            </CardTitle>
            <CardTitle className="text-lg font-semibold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Fee Calculator Portal
            </CardTitle>
          </div>
          <CardDescription className="text-base">
            Get instant fee calculation based on your academic performance
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`transition-all duration-200 ${errors.name ? 'border-destructive focus:ring-destructive' : 'focus:ring-primary'}`}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <p id="name-error" className="text-sm text-destructive animate-in slide-in-from-left-2 duration-200">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number
              </Label>
              <div className="flex gap-2">
                <Select value={countryCode} onValueChange={setCountryCode}>
                  <SelectTrigger className="w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">🇮🇳 +91</SelectItem>
                    <SelectItem value="+1">🇺🇸 +1</SelectItem>
                    <SelectItem value="+44">🇬🇧 +44</SelectItem>
                    <SelectItem value="+61">🇦🇺 +61</SelectItem>
                    <SelectItem value="+86">🇨🇳 +86</SelectItem>
                    <SelectItem value="+81">🇯🇵 +81</SelectItem>
                    <SelectItem value="+49">🇩🇪 +49</SelectItem>
                    <SelectItem value="+33">🇫🇷 +33</SelectItem>
                    <SelectItem value="+39">🇮🇹 +39</SelectItem>
                    <SelectItem value="+34">🇪🇸 +34</SelectItem>
                    <SelectItem value="+7">🇷🇺 +7</SelectItem>
                    <SelectItem value="+55">🇧🇷 +55</SelectItem>
                    <SelectItem value="+52">🇲🇽 +52</SelectItem>
                    <SelectItem value="+27">🇿🇦 +27</SelectItem>
                    <SelectItem value="+971">🇦🇪 +971</SelectItem>
                    <SelectItem value="+966">🇸🇦 +966</SelectItem>
                    <SelectItem value="+65">🇸🇬 +65</SelectItem>
                    <SelectItem value="+60">🇲🇾 +60</SelectItem>
                    <SelectItem value="+66">🇹🇭 +66</SelectItem>
                    <SelectItem value="+84">🇻🇳 +84</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="10-digit phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  maxLength={10}
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  className={`flex-1 transition-all duration-200 ${errors.phone ? 'border-destructive focus:ring-destructive' : 'focus:ring-primary'}`}
                  aria-invalid={!!errors.phone}
                  aria-describedby={errors.phone ? "phone-error" : undefined}
                />
              </div>
              {errors.phone && (
                <p id="phone-error" className="text-sm text-destructive animate-in slide-in-from-left-2 duration-200">
                  {errors.phone}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department" className="text-sm font-medium flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Department
              </Label>
              <Select 
                value={formData.department} 
                onValueChange={(value) => handleInputChange('department', value)}
              >
                <SelectTrigger 
                  className={`transition-all duration-200 ${errors.department ? 'border-destructive focus:ring-destructive' : 'focus:ring-primary'}`}
                  aria-invalid={!!errors.department}
                  aria-describedby={errors.department ? "department-error" : undefined}
                >
                  <SelectValue placeholder="Select your department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CSE">Computer Science & Engineering</SelectItem>
                  <SelectItem value="Mechanical">Mechanical Engineering</SelectItem>
                  <SelectItem value="EEE">Electrical & Electronics Engineering</SelectItem>
                  <SelectItem value="ECE">Electronics & Communication Engineering</SelectItem>
                  <SelectItem value="Civil">Civil Engineering</SelectItem>
                </SelectContent>
              </Select>
              {errors.department && (
                <p id="department-error" className="text-sm text-destructive animate-in slide-in-from-left-2 duration-200">
                  {errors.department}
                </p>
              )}
            </div>

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold py-6 transition-all duration-200 shadow-lg hover:shadow-xl"
              disabled={isLoading || !!errors.name || !!errors.phone || !!errors.department || !formData.name || !formData.phone || !formData.department}
            >
              {isLoading ? "Validating..." : "Continue to Fee Calculator"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};