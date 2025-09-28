"use client";

import { Database } from "@/lib/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type Family = Database['public']['Tables']['families']['Row'];

interface FamilyInfoProps {
  families: Family[];
  selectedFamily: Family;
  onFamilyChange: (family: Family) => void;
}

export function FamilyInfo({ families, selectedFamily, onFamilyChange }: FamilyInfoProps) {
  const [showInviteCode, setShowInviteCode] = useState(false);

  const copyInviteCode = async () => {
    await navigator.clipboard.writeText(selectedFamily.invite_code);
    alert("招待コードをコピーしました！");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>👨‍👩‍👧‍👦 家族グループ</span>
          {families.length > 1 && (
            <select
              value={selectedFamily.id}
              onChange={(e) => {
                const family = families.find(f => f.id === e.target.value);
                if (family) onFamilyChange(family);
              }}
              className="text-sm border rounded px-2 py-1"
            >
              {families.map(family => (
                <option key={family.id} value={family.id}>
                  {family.name}
                </option>
              ))}
            </select>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold">{selectedFamily.name}</h3>
            {selectedFamily.description && (
              <p className="text-sm text-gray-600">{selectedFamily.description}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowInviteCode(!showInviteCode)}
            >
              {showInviteCode ? "招待コードを隠す" : "家族を招待"}
            </Button>
          </div>

          {showInviteCode && (
            <div className="bg-gray-50 p-3 rounded border">
              <p className="text-sm text-gray-600 mb-2">
                家族にこの招待コードを教えてください：
              </p>
              <div className="flex items-center gap-2">
                <code className="bg-white px-3 py-2 rounded border font-mono text-lg flex-1 text-center">
                  {selectedFamily.invite_code}
                </code>
                <Button onClick={copyInviteCode} size="sm">
                  コピー
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}