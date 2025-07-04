// src/components/admin/logs/delete-log-dialog.tsx
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

import { deleteLog, type ActionState } from "@/lib/actions/log-actions"

// Interface para as props do componente
interface DeleteLogDialogProps {
    open: boolean   // Controla a visibilidade do dialog
    onOpenChange: (open: boolean) => void       // Callback para alterar estado
    logId: string | null        // ID do log a ser eliminado
    onLogDeleted?: () => Promise<void>      // Callback após exclusão bem-sucedida
}

// Estado inicial da ação
const initialState: ActionState = {}

export function DeleteLogDialog({ open, onOpenChange, logId, onLogDeleted }: DeleteLogDialogProps) {
    // Gerencia o estado da ação de exclusão
    const [state, formAction, isPending] = useActionState(deleteLog, initialState)

    // Lida com exclusão bem-sucedida
    useEffect(() => {
        if (state.success) {
            onLogDeleted?.()        // Executa callback se necessário
            onOpenChange(false)     // Fecha o dialog
        }
    }, [state.success, onLogDeleted, onOpenChange])

    // Não renderiza se não houver logId
    if (!logId) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px] bg-[#1a1a1a] border border-white/10">
                {/* Cabeçalho do diálogo */}
                <DialogHeader>
                    <DialogTitle className="text-white font-semibold">Confirm Deletion</DialogTitle>
                    <DialogDescription className="text-white/70">
                        Are you sure you want to delete this log entry? This action cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                {/* Formulário para envio da requisição */}
                <form action={formAction}>
                    {/* Input oculto com o ID do log */}
                    <input type="hidden" name="logId" value={logId} />

                    {/* Exibe erros se houver */}
                    {state.error && (
                        <Alert variant="destructive" className="mb-4">
                            <AlertDescription>{state.error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Rodapé com botões de ação */}
                    <DialogFooter className="gap-2">
                        {/* Botão de cancelar */}
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            disabled={isPending}
                            className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        >
                            Cancel
                        </Button>

                        {/* Botão de confirmar exclusão */}
                        <Button type="submit" variant="destructive" disabled={isPending} className="bg-red-600 hover:bg-red-700">
                            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Delete Log
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}