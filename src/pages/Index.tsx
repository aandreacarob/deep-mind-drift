import { CustomCursor } from "@/components/CustomCursor";
import { Beat1 } from "@/components/beats/Beat1";
import { Beat2 } from "@/components/beats/Beat2";
import { Beat3 } from "@/components/beats/Beat3";
import { Beat4 } from "@/components/beats/Beat4";
import { Beat5 } from "@/components/beats/Beat5";

const Index = () => {
  return (
    <div className="relative">
      <CustomCursor />
      <Beat1 />
      <Beat2 />
      <Beat3 />
      <Beat4 />
      <Beat5 />
    </div>
  );
};

export default Index;
