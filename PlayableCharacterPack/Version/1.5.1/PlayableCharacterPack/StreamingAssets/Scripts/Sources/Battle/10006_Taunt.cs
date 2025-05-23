using System;
using System.Collections.Generic;
using Memoria;
using Memoria.Data;
using FF9;

namespace Memoria.Scripts.Battle
{
    /// <summary>
    /// Taunt: force the enemy to target the user for their next attack
    /// </summary>
    [BattleScript(Id)]
    public sealed class TauntScript : IBattleScript
    {
        public const Int32 Id = 10006;
		
        private readonly BattleCalculator _v;

        public TauntScript(BattleCalculator v)
        {
            _v = v;
        }

        public void Perform()
        {
			// TODO
        }
    }
}
