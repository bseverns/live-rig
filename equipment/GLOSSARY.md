# Glossary

## Rig truth

The current trusted patch: what is physically connected, validated, hand-tested, and safe enough to use tonight.

## Equipment truth

The broader library of boxes, software hosts, processors, manuals, sources, and dormant objects that can be remembered, taught, loaned, repaired, or mustered.

## Passport

A single equipment page that explains identity, role, I/O, sources, muster steps, failure modes, safe removal, and open questions.

## Muster

To call an object into service deliberately: name its role, confirm its I/O, verify clock/control behavior, and document the smallest working patch.

## Clock boss

The single device or runtime that owns clock and transport for a patch. There must be exactly one.

## Follower

A device that receives clock or transport and does not lead or forward it unless explicitly intended.

## Safety anchor

A recovery state that must stay reachable under pressure. In this repo the anchors are `state.blackout` and `scene.clean_camera`.

## Audio-only survival

The room can still hear the set even if analysis, visuals, secondary endpoints, or optional controllers fail.

## Endpoint

A visual or runtime target that consumes scene/state/control messages. Endpoints react; they do not own global rig logic.

## Semantic ID

The meaning of a control event, such as `scene.intro` or `state.blackout`. Raw MIDI note and CC values are transport details.

## Loanable

Documented enough that someone else can borrow or operate the object without guessing the basics: power, I/O, safe defaults, and what not to touch.
