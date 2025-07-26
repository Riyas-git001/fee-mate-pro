import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { 
  Trophy, 
  Star, 
  ThumbsUp, 
  Target, 
  Calculator,
  ArrowLeft,
  Percent,
  IndianRupee,
  Building2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudentData {
  name: string;
  phone: string;
  department: string;
}

interface FeeCalculatorProps {
  studentData: StudentData;
  onBack: () => void;
}

interface FeeResult {
  percentage: number;
  baseFee: number;
  discount: number;
  totalFee: number;
  performanceLevel: 'excellent' | 'good' | 'average' | 'needs-improvement';
  message: string;
  icon: React.ReactNode;
}

export const FeeCalculator = ({ studentData, onBack }: FeeCalculatorProps) => {
  const [physics, setPhysics] = useState<string>("");
  const [maths, setMaths] = useState<string>("");
  const [chemistry, setChemistry] = useState<string>("");
  const [result, setResult] = useState<FeeResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  // Calculate fee based on average percentage
  const calculateFee = (marks: number): FeeResult => {
    let baseFee: number;
    let performanceLevel: 'excellent' | 'good' | 'average' | 'needs-improvement';
    let message: string;
    let icon: React.ReactNode;

    if (marks >= 90) {
      baseFee = 10000;
      performanceLevel = 'excellent';
      message = 'Outstanding performance! Keep up the excellent work!';
      icon = <Trophy className="w-6 h-6 text-yellow-500" />;
    } else if (marks >= 75) {
      baseFee = 15000;
      performanceLevel = 'good';
      message = 'Great job! You\'re doing really well!';
      icon = <Star className="w-6 h-6 text-blue-500" />;
    } else if (marks >= 50) {
      baseFee = 20000;
      performanceLevel = 'average';
      message = 'Good effort! There\'s room for improvement!';
      icon = <ThumbsUp className="w-6 h-6 text-green-500" />;
    } else {
      baseFee = 25000;
      performanceLevel = 'needs-improvement';
      message = 'Don\'t give up! Every effort counts towards success!';
      icon = <Target className="w-6 h-6 text-orange-500" />;
    }

    // Apply 5% scholarship discount for 95% and above
    const discount = marks >= 95 ? baseFee * 0.05 : 0;
    const totalFee = baseFee - discount;

    return {
      percentage: marks,
      baseFee,
      discount,
      totalFee,
      performanceLevel,
      message,
      icon
    };
  };

  // Submit calculation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(physics);
    const m = parseFloat(maths);
    const c = parseFloat(chemistry);
    if ([p, m, c].some((v) => isNaN(v) || v < 0 || v > 100)) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid percentages (0-100) for all subjects.",
        variant: "destructive",
      });
      return;
    }
    const avg = Math.round((p + m + c) / 3);
    setIsCalculating(true);
    setTimeout(() => {
      const calculatedResult = calculateFee(avg);
      setResult(calculatedResult);
      setIsCalculating(false);
      toast({
        title: "Fee Calculated!",
        description: `Your fee for average ${avg}% marks: ₹${calculatedResult.totalFee.toLocaleString()}`,
      });
    }, 1000);
  };

  // Get department color
  const getDepartmentColor = (department: string) => {
    switch (department) {
      case 'CSE': return 'bg-blue-600 text-white';
      case 'Mechanical': return 'bg-gray-600 text-white';
      case 'EEE': return 'bg-yellow-600 text-white';
      case 'ECE': return 'bg-green-600 text-white';
      case 'Civil': return 'bg-orange-600 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // Get performance color
  const getPerformanceColor = (level: string) => {
    switch (level) {
      case 'excellent': return 'bg-excellent text-white';
      case 'good': return 'bg-good text-white';
      case 'average': return 'bg-average text-white';
      case 'needs-improvement': return 'bg-needs-improvement text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  // Get progress color
  const getProgressColor = (marks: number) => {
    if (marks >= 90) return 'bg-excellent';
    if (marks >= 75) return 'bg-good';
    if (marks >= 50) return 'bg-average';
    return 'bg-needs-improvement';
  };

  return (
    <div className="min-h-screen relative overflow-hidden p-4 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      {/* Background Images */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute top-20 left-10 w-24 h-24 opacity-15 bg-contain bg-no-repeat rotate-12"
          style={{ backgroundImage: "url('/lovable-uploads/d78c4b7b-23b9-40d4-9e3d-666386fe827e.png')" }}
        />
        <div 
          className="absolute top-40 right-10 w-28 h-28 opacity-10 bg-contain bg-no-repeat -rotate-12"
          style={{ backgroundImage: "url('/lovable-uploads/d78c4b7b-23b9-40d4-9e3d-666386fe827e.png')" }}
        />
        <div 
          className="absolute bottom-0 right-0 w-96 h-32 opacity-25 bg-contain bg-no-repeat bg-right"
          style={{ backgroundImage: "url('/lovable-uploads/9dfd99c1-825d-4125-bfad-91f59bf80be6.png')" }}
        />
      </div>
      
      <div className="max-w-2xl mx-auto space-y-6 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={onBack}
            className="hover:bg-secondary"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">Fee Calculator</h1>
            <p className="text-muted-foreground">Welcome, {studentData.name}</p>
            <Badge className={`mt-2 ${getDepartmentColor(studentData.department)}`}>
              <Building2 className="w-3 h-3 mr-1" />
              {studentData.department}
            </Badge>
          </div>
        </div>

        {/* Calculator Card */}
        <Card className="shadow-xl border-0 bg-card/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Enter Your Marks
            </CardTitle>
            <CardDescription>
              Enter the percentage for each subject below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Percent className="w-4 h-4" />
                  Physics Percentage
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={physics}
                  onChange={(e) => setPhysics(e.target.value)}
                  className="w-24 text-center"
                  placeholder="0-100"
                />
                <Label className="text-base font-medium flex items-center gap-2">
                  <Percent className="w-4 h-4" />
                  Maths Percentage
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={maths}
                  onChange={(e) => setMaths(e.target.value)}
                  className="w-24 text-center"
                  placeholder="0-100"
                />
                <Label className="text-base font-medium flex items-center gap-2">
                  <Percent className="w-4 h-4" />
                  Chemistry Percentage
                </Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={chemistry}
                  onChange={(e) => setChemistry(e.target.value)}
                  className="w-24 text-center"
                  placeholder="0-100"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold py-6 transition-all duration-200 shadow-lg hover:shadow-xl"
                disabled={isCalculating}
              >
                {isCalculating ? "Calculating..." : "Calculate Fee"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Result Card */}
        {result && (
          <Card className="shadow-xl border-0 bg-card/90 backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-primary" />
                Fee Calculation Result
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Performance Badge */}
              <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                <Badge className={`px-3 py-1 text-xs font-medium ${getDepartmentColor(studentData.department)}`}>
                  <Building2 className="w-3 h-3 mr-1" />
                  {studentData.department}
                </Badge>
                <div className="flex items-center gap-2">
                  {result.icon}
                  <Badge className={`px-4 py-2 text-sm font-semibold ${getPerformanceColor(result.performanceLevel)}`}>
                    {result.percentage}% - {result.performanceLevel.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
              </div>

              {/* Motivational Message */}
              <div className="text-center">
                <p className="text-lg font-medium text-foreground">{result.message}</p>
              </div>

              {/* Fee Breakdown */}
              <div className="space-y-3 bg-muted/50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Base Fee:</span>
                  <span className="font-semibold">₹{result.baseFee.toLocaleString()}</span>
                </div>
                
                {result.discount > 0 && (
                  <div className="flex justify-between items-center text-excellent">
                    <span>Scholarship Discount (5%):</span>
                    <span className="font-semibold">-₹{result.discount.toLocaleString()}</span>
                  </div>
                )}
                
                <hr className="border-border" />
                
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total Fee:</span>
                  <span className="text-primary">₹{result.totalFee.toLocaleString()}</span>
                </div>
              </div>

              {/* Scholarship Notice */}
              {result.percentage >= 95 && (
                <div className="bg-excellent/10 border border-excellent/20 rounded-lg p-4 text-center">
                  <p className="text-excellent font-semibold">
                    🎉 Congratulations! You've earned a 5% scholarship discount!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};