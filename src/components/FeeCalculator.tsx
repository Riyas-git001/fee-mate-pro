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
  IndianRupee
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudentData {
  name: string;
  phone: string;
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
  const [percentage, setPercentage] = useState<number>(75);
  const [manualInput, setManualInput] = useState<string>("75");
  const [result, setResult] = useState<FeeResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  // Calculate fee based on percentage
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

  // Handle slider change
  const handleSliderChange = (value: number[]) => {
    const newValue = value[0];
    setPercentage(newValue);
    setManualInput(newValue.toString());
  };

  // Handle manual input change
  const handleManualInputChange = (value: string) => {
    setManualInput(value);
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      setPercentage(numValue);
    }
  };

  // Submit calculation
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (percentage < 0 || percentage > 100) {
      toast({
        title: "Invalid Percentage",
        description: "Please enter a percentage between 0 and 100.",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);
    
    // Simulate API call
    setTimeout(() => {
      const calculatedResult = calculateFee(percentage);
      setResult(calculatedResult);
      setIsCalculating(false);
      
      toast({
        title: "Fee Calculated!",
        description: `Your fee for ${percentage}% marks: ₹${calculatedResult.totalFee.toLocaleString()}`,
      });
    }, 1000);
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
    <div className="min-h-screen p-4 bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="max-w-2xl mx-auto space-y-6">
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
          <div>
            <h1 className="text-2xl font-bold">Fee Calculator</h1>
            <p className="text-muted-foreground">Welcome, {studentData.name}</p>
          </div>
        </div>

        {/* Calculator Card */}
        <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Enter Your Marks
            </CardTitle>
            <CardDescription>
              Adjust the slider or enter your percentage manually
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Percentage Input */}
              <div className="space-y-4">
                <Label className="text-base font-medium flex items-center gap-2">
                  <Percent className="w-4 h-4" />
                  Your Percentage: {percentage}%
                </Label>
                
                {/* Slider */}
                <div className="px-2">
                  <Slider
                    value={[percentage]}
                    onValueChange={handleSliderChange}
                    max={100}
                    min={0}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0%</span>
                    <span>50%</span>
                    <span>100%</span>
                  </div>
                </div>

                {/* Manual Input */}
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={manualInput}
                    onChange={(e) => handleManualInputChange(e.target.value)}
                    className="w-24 text-center"
                    placeholder="0-100"
                  />
                  <span className="text-muted-foreground">%</span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Performance Level</span>
                    <span className="font-medium">
                      {percentage >= 90 ? 'Excellent' : 
                       percentage >= 75 ? 'Good' : 
                       percentage >= 50 ? 'Average' : 'Needs Improvement'}
                    </span>
                  </div>
                  <div className="relative">
                    <Progress value={percentage} className="h-3" />
                    <div 
                      className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-300 ${getProgressColor(percentage)}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
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
          <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm animate-in slide-in-from-bottom-4 duration-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <IndianRupee className="w-5 h-5 text-primary" />
                Fee Calculation Result
              </CardTitle>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Performance Badge */}
              <div className="flex items-center justify-center gap-3">
                {result.icon}
                <Badge className={`px-4 py-2 text-sm font-semibold ${getPerformanceColor(result.performanceLevel)}`}>
                  {result.percentage}% - {result.performanceLevel.replace('-', ' ').toUpperCase()}
                </Badge>
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