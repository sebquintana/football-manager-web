"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CreditCard,
  DollarSign,
  TrendingUp,
  Activity,
  Download,
  Filter,
  Search,
} from "lucide-react"
import { Input } from "@/components/ui/input"

const transactions = [
  {
    id: "1",
    description: "Salary Deposit",
    amount: "+$3,200.00",
    date: "2024-01-15",
    category: "Income",
    status: "completed",
  },
  {
    id: "2",
    description: "Grocery Store",
    amount: "-$87.50",
    date: "2024-01-14",
    category: "Food",
    status: "completed",
  },
  {
    id: "3",
    description: "Netflix Subscription",
    amount: "-$15.99",
    date: "2024-01-13",
    category: "Entertainment",
    status: "completed",
  },
  {
    id: "4",
    description: "Investment Return",
    amount: "+$450.00",
    date: "2024-01-12",
    category: "Investment",
    status: "completed",
  },
  {
    id: "5",
    description: "Electric Bill",
    amount: "-$120.00",
    date: "2024-01-11",
    category: "Utilities",
    status: "pending",
  },
]

const budgets = [
  { category: "Food & Dining", spent: 850, budget: 1200, color: "bg-blue-500" },
  { category: "Transportation", spent: 320, budget: 500, color: "bg-green-500" },
  { category: "Entertainment", spent: 180, budget: 300, color: "bg-purple-500" },
  { category: "Shopping", spent: 420, budget: 600, color: "bg-orange-500" },
]

export function Dashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpIcon className="h-3 w-3 mr-1" />
                +20.1%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$12,234.00</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpIcon className="h-3 w-3 mr-1" />
                +8.2%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,456.78</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-600 flex items-center">
                <ArrowDownIcon className="h-3 w-3 mr-1" />
                -2.4%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center">
                <ArrowUpIcon className="h-3 w-3 mr-1" />
                +5.1%
              </span>
              from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Budget Overview */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Budget Overview</CardTitle>
            <CardDescription>Your spending by category this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {budgets.map((budget) => (
              <div key={budget.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${budget.color}`} />
                    <span className="text-sm font-medium">{budget.category}</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ${budget.spent} / ${budget.budget}
                  </div>
                </div>
                <Progress value={(budget.spent / budget.budget) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Key financial metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Credit Score</span>
              <Badge variant="secondary">Excellent</Badge>
            </div>
            <div className="text-2xl font-bold">785</div>
            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Investment Portfolio</span>
                <span className="text-sm font-medium">$28,450</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Emergency Fund</span>
                <span className="text-sm font-medium">$15,000</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Debt</span>
                <span className="text-sm font-medium text-red-600">$2,340</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest financial activity</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search transactions..." className="pl-8 w-64" />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{transaction.category}</Badge>
                  </TableCell>
                  <TableCell>{transaction.date}</TableCell>
                  <TableCell>
                    <Badge variant={transaction.status === "completed" ? "default" : "secondary"}>
                      {transaction.status}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      transaction.amount.startsWith("+") ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {transaction.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
