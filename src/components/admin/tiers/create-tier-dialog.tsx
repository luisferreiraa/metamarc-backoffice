// src/components/admin/tiers/create-tier-dialog.tsx
"use client"

import { useActionState, useEffect } from "react"
import { Loader2 } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

import { createTier, type CreateTierState } from "@/lib/actions/tier-actions"

// Interface para as props esperadas pelo componente
interface CreateTierDialogProps {
    open: boolean       // Controla a visibilidade do dialog
    onOpenChange: (open: boolean) => void       // Callback para alterar estado
    onTierCreated: () => void       // Callback após criação bem-sucedida
}

// Estado inicial para a ação de criação
const initialState: CreateTierState = {}

export function CreateTierDialog({ open, onOpenChange, onTierCreated }: CreateTierDialogProps) {
    // Gerencia o estado da acção de criação
    // useActionState é um hook experimental do React para gerenciar estados de formulários
    const [state, formAction, isPending] = useActionState(createTier, initialState)

    // Lida com criação bem sucedida
    useEffect(() => {
        if (state.success) {
            onTierCreated()     // Executa callback de sucesso
            onOpenChange(false)     // Fecha o dialog
        }
    }, [state.success, onTierCreated, onOpenChange])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#0a0a0a] border-white/10 [font-family:var(--font-poppins)]">
                {/* Cabeçalho do dialog */}
                <DialogHeader>
                    <DialogTitle className="text-[#66b497]">Create New Tier</DialogTitle>
                    <DialogDescription className="text-white/70">Fill in the data to create a new tier</DialogDescription>
                </DialogHeader>

                {/* Formulário de criação */}
                <form action={formAction} className="space-y-4">
                    {/* Exibição de erros gerais */}
                    {state.error && (
                        <Alert variant="destructive">
                            <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Campo: Nome do Tier */}
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-white">
                            Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            className="border-white/10 bg-[#111111] text-white"
                            required        // Obrigatório
                            disabled={isPending}        // Desabilita durante o carregamento
                        />
                        {/* Exibição de erros específicos do campo */}
                        {state.fieldErrors?.name && <p className="text-sm text-red-500">{state.fieldErrors.name[0]}</p>}
                    </div>

                    {/* Campo: Descrição */}
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-white">
                            Description
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            className="border-white/10 bg-[#111111] text-white resize-none"
                            rows={3}
                            required
                            disabled={isPending}
                        />
                        {state.fieldErrors?.description && (
                            <p className="text-sm text-red-500">{state.fieldErrors.description[0]}</p>
                        )}
                    </div>

                    {/* Campo: Preço (em cêntimos) */}
                    <div className="space-y-2">
                        <Label htmlFor="priceInCents" className="text-white">
                            Price (in cents)
                        </Label>
                        <Input
                            id="priceInCents"
                            name="priceInCents"
                            type="number"
                            min="0"
                            step="1"
                            className="border-white/10 bg-[#111111] text-white"
                            required
                            disabled={isPending}
                        />
                        {state.fieldErrors?.priceInCents && (
                            <p className="text-sm text-red-500">{state.fieldErrors.priceInCents[0]}</p>
                        )}
                    </div>

                    {/* Campo: Features (opcional) */}
                    <div className="space-y-2">
                        <Label htmlFor="features" className="text-white">
                            Features
                        </Label>
                        <Textarea
                            id="features"
                            name="features"
                            placeholder="Separate features with semicolons (;)"
                            className="border-white/10 bg-[#111111] text-white placeholder-white/30 resize-none"
                            rows={3}
                            disabled={isPending}
                        />
                        <p className="text-xs text-white/50">Optional: List features separated by semicolons</p>
                        {state.fieldErrors?.features && <p className="text-sm text-red-500">{state.fieldErrors.features[0]}</p>}
                    </div>

                    {/* Rodapé do dialog com botões de acção */}
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending} className="bg-white text-black hover:bg-white/90">
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Tier
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}


