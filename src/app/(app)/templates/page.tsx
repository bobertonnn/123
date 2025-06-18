"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { FileText, PlusCircle, Edit, Trash2, Search } from "lucide-react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

const mockTemplates = [
  { id: "tpl1", name: "Standard NDA", description: "Non-Disclosure Agreement for new clients.", lastModified: "2023-10-15" },
  { id: "tpl2", name: "Employee Onboarding Packet", description: "Collection of forms for new hires.", lastModified: "2023-09-20" },
  { id: "tpl3", name: "Consulting Agreement", description: "Standard terms for consulting services.", lastModified: "2023-11-01" },
];

export default function TemplatesPage() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold font-headline">Document Templates</h1>
        <Button asChild className="btn-gradient-hover">
          <Link href="/templates/create">
            <PlusCircle className="mr-2 h-5 w-5" />
            <span>Create New Template</span>
          </Link>
        </Button>
      </div>

      <div className="mb-6 p-4 bg-card rounded-lg shadow">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search templates..." className="pl-8" />
        </div>
      </div>

      {mockTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
            <Card className="flex flex-col h-full rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
              <CardHeader>
                <FileText className="h-10 w-10 text-primary mb-2" />
                <CardTitle className="text-lg font-headline">{template.name}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground h-12 overflow-hidden text-ellipsis">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-xs text-muted-foreground">Last Modified: {template.lastModified}</p>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link href={`/templates/${template.id}/edit`}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </Link>
                </Button>
                <Button variant="destructive" size="sm" className="flex-1">
                  <Trash2 className="mr-2 h-4 w-4" /> Delete
                </Button>
              </CardFooter>
            </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-card rounded-lg shadow">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-xl font-semibold">No Templates Yet</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first template to speed up document preparation.
          </p>
          <Button className="mt-6 btn-gradient-hover" asChild>
            <Link href="/templates/create">
              <PlusCircle className="mr-2 h-4 w-4" /> <span>Create Template</span>
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
