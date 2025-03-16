import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TokenDisplayProps {
  newTokens: number
  totalTokens: number
}

export function TokenDisplay({ newTokens, totalTokens }: TokenDisplayProps) {
  return (
    <Card className="h-full bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700">
      <CardHeader className="p-2">
        <CardTitle className="text-sm font-bold text-white">獲得トークン</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="text-center">
          <p className="text-3xl font-bold text-yellow-400">+{newTokens.toFixed(1)}</p>
          <p className="text-sm text-gray-400 mt-1">合計: {totalTokens.toFixed(1)} LOL</p>
        </div>
        {/* スマイルスコア表示は現在コメントアウトされています */}
      </CardContent>
    </Card>
  )
}

